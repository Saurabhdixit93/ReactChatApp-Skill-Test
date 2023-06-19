import {initializeApp} from "firebase/app";
import  { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: import.meta.env.VITE_REACT_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_REACT_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_REACT_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_FIREBASE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_REACT_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();



 