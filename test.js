// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_6qTkbEspDOoOIKbzIVba21MbitOy7FU",
  authDomain: "moonlight-cafe-1437e.firebaseapp.com",
  projectId: "moonlight-cafe-1437e",
  storageBucket: "moonlight-cafe-1437e.appspot.com",
  messagingSenderId: "479996028236",
  appId: "1:479996028236:web:532a780d89a0cf9d95dbe9",
  measurementId: "G-TLM3L5VJLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);