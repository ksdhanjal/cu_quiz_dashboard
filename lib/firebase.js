// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getFunctions, connectFunctionsEmulator} from "firebase/functions"


const firebaseConfig = {
  apiKey: "AIzaSyCvIb81IdqRdxm2nS2b6KjEND__VszNN1Y",
  authDomain: "cu-quiz-portal.firebaseapp.com",
  projectId: "cu-quiz-portal",
  storageBucket: "cu-quiz-portal.appspot.com",
  messagingSenderId: "188282162132",
  appId: "1:188282162132:web:a42dace97061a2a90f2441",
  measurementId: "G-48F4ND6KXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "localhost", 5001);
export {functions};