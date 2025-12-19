import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdfO4C21ks3Zuf5qPY_QNOflCVrsRzECs",
  authDomain: "gogreen-d6100.firebaseapp.com",
  projectId: "gogreen-d6100",
  storageBucket: "gogreen-d6100.appspot.com",
  messagingSenderId: "298832040055",
  appId: "1:298832040055:android:e52d6a429b3c3078a3b672"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);
