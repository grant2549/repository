import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import CharacterCard from './CharacterCard';
import { Character } from './CharacterCard';

const UserCharacters: React.FC = () => {
  const [user] = useAuthState(auth);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchUserCharacters = async () => {
      if (user) {
        const q = query(collection(db, 'characters'), where('authorID', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userCharacters: Character[] = [];
        querySnapshot.forEach((doc) => {
          const character = {
            ...doc.data(),
            id: doc.id
          } as Character;

          userCharacters.push(character);
        });
        setCharacters(userCharacters);
      }
    };

    fetchUserCharacters();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((character) => (
        <CharacterCard 
          key={character.id} 
          character={character} 
          name={character.name} 
          race={character.race} 
          classLevel={character.classLevel} 
          background={character.background} 
          personality={character.personality} 
          equipment={character.equipment} 
          spellsAbilities={character.spellsAbilities} 
          abilityScores={character.abilityScores} 
          bonds={character.bonds} 
          alignment={character.alignment} 
          createdOn={character.createdOn} 
          imageUrl={character.imageUrl} 
          collectionId={character.collectionId} 
          description={character.description} 
          userId={character.userId} 
          appearance={character.appearance} 
        />
      ))}
    </div>
  );
};

export default UserCharacters;
