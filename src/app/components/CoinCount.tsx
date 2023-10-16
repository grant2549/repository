import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have a Firebase instance named 'db'
import { auth } from '../firebase';

const fetchCoinCountFromFirestore = async () => {
    try {
    const userId = auth.currentUser?.uid; // Get the current user's UID
    if (!userId) {
    return 0; // Return default value if user is not authenticated
    }
    const userDocRef = doc(db, `users/${userId}`);
    const userDocSnapshot = await getDoc(userDocRef);
    
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const coinCount = userData?.coins || 0;
      return coinCount;
    }    
} catch (error) {
    console.error('Error fetching coin count from Firestore:', error);
    }
    
    return 0; // Default value if fetching fails or document doesn't exist
    };
    
    export default fetchCoinCountFromFirestore;