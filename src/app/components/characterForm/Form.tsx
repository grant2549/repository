'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { auth, db } from '@/app/firebase';
import Input from './Input';
import Checkbox from './Checkbox';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import qs from 'qs';
import fetchCoinCountFromFirestore from '../CoinCount';
import updateCoinCountInFirestore from '../updateCoinCountInFirestore';
import fetchCharacterDetails from '../fetchCharacterFromFirebase';
import CharacterDetails from '../CharacterDetail';
import { Character } from '../CharacterCard';
import { doc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';
import '../../styles/style.css';
import { DocumentData } from 'firebase/firestore';

interface CharacterForm {
  uuid: string;
  userId: string | null;
  name: string;
  level: string;
  description: string;
  profilePhoto: boolean;
  aiName: boolean;
  aiDescription: boolean;
  dateCreated?: string;
  coinCount?: number;
}

const Form: React.FC = () => {
  const [character, setCharacter] = useState<CharacterForm>({
    uuid: uuidv4(),
    userId: null,
    name: '',
    level: '',
    description: '',
    profilePhoto: false,
    aiName: false,
    aiDescription: false,
  });
  const [userCoinCount, setUserCoinCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [characterDetails, setCharacterDetails] = useState<Character | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);  

  useEffect(() => {
    const fetchCoinCount = async () => {
      const userCoinCount = await fetchCoinCountFromFirestore();
      setUserCoinCount(userCoinCount);
    };

    fetchCoinCount();
  }, []);
  
 // Fetch subscription status
 useEffect(() => {
  const fetchSubscriptionStatus = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userRef = doc(db, 'users', userId);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const subscriptionCollectionRef = collection(userRef, 'subscriptions');
          const subscriptionSnapshot = await getDocs(subscriptionCollectionRef);
          subscriptionSnapshot.forEach((subscriptionDoc: DocumentData) => {
            const subscriptionStatus = subscriptionDoc.data().status;
            if (subscriptionStatus === 'active') {
              setHasSubscription(true);
            }
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    }
  };

  fetchSubscriptionStatus();
}, []);
  useEffect(() => {
    const characterDocRef = doc(db, 'characters', character.uuid);

    const unsubscribe = onSnapshot(characterDocRef, (snapshot) => {
      const source = snapshot.metadata.hasPendingWrites ? 'Local' : 'Server';
      console.log(source, ' data: ', snapshot.data());
    });

    return () => {
      unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
    };
  }, [character.uuid]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCharacter({ ...character, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCharacter({ ...character, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dateCreated = new Date().toISOString();
    const userId = auth.currentUser?.uid;
  
    if (!userId) {
      window.alert('You must be signed in to create a character');
      return;
    }

    const userRef = doc(db, 'users', userId);
    let hasSubscription = false;
    
    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Access subscriptions collection within user document
        const subscriptionCollectionRef = collection(userRef, 'subscriptions');
        const subscriptionSnapshot = await getDocs(subscriptionCollectionRef);
        subscriptionSnapshot.forEach((subscriptionDoc: DocumentData) => {
          // Access the status field
          const subscriptionStatus = subscriptionDoc.data().status;

          switch (subscriptionStatus) {
            case 'active':
              // User has an active subscription
              hasSubscription = true;  // Update local variable here
              console.log(subscriptionStatus)
              break;
            case 'canceled':
              // User has a canceled subscription
              hasSubscription = false;  // Update local variable here
              break;
            // Add more cases if you have more statuses
            default:
              // User has an unknown subscription status
              console.error('Unknown subscription status:', subscriptionStatus);
              break;
          }
        });
      } else {
        // The document does not exist
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
    if (!hasSubscription) {
      // Deduct coins from the user's account only if they don't have a subscription
      const updatedCoinCount = userCoinCount - 100;
  
      if (updatedCoinCount < 0) {
        window.alert('You do not have enough coins to create a character');
        return;
      }
  
      await updateCoinCountInFirestore(userId, updatedCoinCount);
      setUserCoinCount(updatedCoinCount);
    }
  
    const characterWithUuid = {
      ...character,
      uuid: uuidv4(),
      dateCreated,
      userId: userId || null,
    };
  
    try {
      setLoading(true);
  
      // Get the current user's ID token
      const idToken = await auth.currentUser?.getIdToken();
  
      const response =  axios.post(
        'http://localhost:3000/api/createCharacter',
        characterWithUuid,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,  
          },
        }
      );
  
      const characterDocRef = doc(db, 'characters', characterWithUuid.uuid);
      console.log(characterWithUuid)
      const unsubscribe = onSnapshot(characterDocRef, async (snapshot) => {
  
        if (snapshot.exists()) {
          const fetchedCharacter = await fetchCharacterDetails(
            characterWithUuid.uuid,
            0
          );
          console.log("character found")
          setCharacterDetails(fetchedCharacter); 
          setLoading(false);
          unsubscribe(); // Unsubscribe here, to avoid multiple listeners on the same document
        }
  
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // This will make it centered vertically for the entire viewport,
        width: '100vh'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column', // This will make the loader and text appear in a column
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px', // Set the dimensions for the square
          width: '200px',
          backgroundColor: '#f5f5f5', // Set the background color of the square
          borderRadius: '10px', // Optional: Rounded corners
          boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.1)', // Optional: Box shadow for 3D effect
        }}>
          <BeatLoader color="#3498db" loading={loading} size={20} />
          <p style={{marginTop: '10px'}}>Loading character...</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      {characterDetails && <CharacterDetails character={characterDetails} onClose={() => setCharacterDetails(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="font-inter inline-flex h-[462px] w-[403px] flex-col items-start gap-10 rounded-2xl bg-[#2C2D3A] px-10 pb-3.5 pt-12 text-white">
          <div className="flex w-full flex-col items-start gap-1 self-stretch text-left font-[700]">
            <p className="w-[222px] text-2xl leading-8">Create a Character</p>
          </div>
          <div className="flex w-full flex-col items-start gap-6 self-stretch">
            {/* Name input */}
            <div className="font-inter inline-flex w-full flex-col items-start gap-2 self-stretch text-left font-[500]">
              <label htmlFor="name" className="w-[34px] text-xs leading-4 text-white transition-all">Name</label>
              <input
                id="name"
                name="name"
                className="h-10 w-full rounded-3xl py-3 pl-9 pr-11 transition-all [box-shadow-width:1px] [box-shadow:0px_0px_0px_1px_rgba(216,_216,_216,_1)_inset] bg-[#2C2D3A] text-white"
                placeholder="Enter a Name / Leave blank for an AI name"
                value={character.name}
                onChange={handleInputChange}
              />
            </div>
            {/* Level input */}
            <div className="font-inter inline-flex w-full flex-col items-start gap-2 self-stretch text-left font-[500]">
              <label htmlFor="level" className="w-[31px] text-xs leading-4 text-white transition-all">Level</label>
              <input
                id="level"
                name="level"
                className="h-10 w-full rounded-3xl py-3 pl-9 pr-[19px] transition-all [box-shadow-width:1px] [box-shadow:0px_0px_0px_1px_rgba(216,_216,_216,_1)_inset] bg-[#2C2D3A] text-white"
                placeholder="Enter a level / Leave blank for a random level"
                value={character.level}
                onChange={handleInputChange}
              />
            </div>
            {/* Description input */}
            <div className="font-inter inline-flex w-full flex-col items-start gap-2 self-stretch text-left font-[500]">
              <label htmlFor="description" className="w-[66px] text-xs leading-4 text-white transition-all">Description</label>
              <input
                id="description"
                name="description"
                className="h-10 w-full rounded-3xl py-3 pl-9 pr-[83px] transition-all [box-shadow-width:1px] [box-shadow:0px_0px_0px_1px_rgba(216,_216,_216,_1)_inset] bg-[#2C2D3A] text-white"
                placeholder="Enter a description of the character"
                value={character.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full gap-[19px] text-center font-[500]">
            <div className="flex h-12 w-full items-center justify-center self-stretch">
              <button type="submit" className="flex h-full w-full items-center justify-center rounded-3xl bg-[#E33319] px-[147px] py-3.5">
                <p className="h-5 w-7 text-base leading-5">Roll</p>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


interface CreateCharacterBoxProps {
  className: string;
  style: Object;
}

export default Form;
