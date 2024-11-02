// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkZIgjJ2zMhD8GKf9KQpiwe4iozVc7wrQ",
  authDomain: "resultstable-eb6bb.firebaseapp.com",
  projectId: "resultstable-eb6bb",
  storageBucket: "resultstable-eb6bb.appspot.com",
  messagingSenderId: "1050970316609",
  appId: "1:1050970316609:web:ead99fa5446c62bedecbc0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);