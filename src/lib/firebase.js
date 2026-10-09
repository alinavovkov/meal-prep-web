import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBV-cLhMyYHcFdC6V-ZYQ1OQbul5TPa5Eo",
  authDomain: "meal-planner-f0fea.firebaseapp.com",
  projectId: "meal-planner-f0fea",
  storageBucket: "meal-planner-f0fea.firebasestorage.app",
  messagingSenderId: "795072203485",
  appId: "1:795072203485:web:5705bf1817cbead28ba934",
  measurementId: "G-2Q2ZSGZYG1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const appId = 'my-meal-planner';
