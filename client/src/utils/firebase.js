
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "interviewedge-aae1f.firebaseapp.com",
  projectId: "interviewedge-aae1f",
  storageBucket: "interviewedge-aae1f.firebasestorage.app",
  messagingSenderId: "90988099932",
  appId: "1:90988099932:web:d511f73f9ac25d39946999"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}
