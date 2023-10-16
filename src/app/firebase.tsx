import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import firebase from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import * as admin from "firebase-admin";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtuxeOh3O32FdHLFrvigzT_H-dk_Xbiww",
  authDomain: "dm-advantage.firebaseapp.com",
  databaseURL: "/pages/api/dm-advantage-firebase-adminsdk-bb5l1-e568cd0627.json",
  projectId: "dm-advantage",
  storageBucket: "dm-advantage.appspot.com",
  messagingSenderId: "613326345723",
  appId: "1:613326345723:web:7158226a4ac77f0b9a275e",
  measurementId: "G-5TJZ3GRRK3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
;
export { firebase, app, auth, db };