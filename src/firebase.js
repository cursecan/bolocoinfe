// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: "mya-owesome.firebaseapp.com",
  projectId: "mya-owesome",
  storageBucket: "mya-owesome.firebasestorage.app",
  messagingSenderId: "233054801238",
  appId: "1:233054801238:web:eed29e37a9afe86441daf7",
  measurementId: "G-NZDMDM93ZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {
    db
}
