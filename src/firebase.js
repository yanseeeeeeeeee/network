// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw8g8nURtwirmq4LNb3NZNd3FxbRk0HOY",
  authDomain: "react-project-2473d.firebaseapp.com",
  projectId: "react-project-2473d",
  storageBucket: "react-project-2473d.firebasestorage.app",
  messagingSenderId: "610973259318",
  appId: "1:610973259318:web:fba95007192478f8d2ea97",
  measurementId: "G-K7L7ZG1C9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);