import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have a Firebase instance named 'db'

const updateCoinCountInFirestore = async (userId: string, updatedCoinCount: number) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { coins: updatedCoinCount }, { merge: true });
    console.log('Coin count updated successfully');
  } catch (error) {
    console.error('Error updating coin count in Firestore:', error);
    // Handle error
  }
};

export default updateCoinCountInFirestore;
