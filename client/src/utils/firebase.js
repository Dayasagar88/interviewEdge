
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "interviewedge-ai.firebaseapp.com",
  projectId: "interviewedge-ai",
  storageBucket: "interviewedge-ai.firebasestorage.app",
  messagingSenderId: "603171103258",
  appId: "1:603171103258:web:36bc0298f811ebb4cf67a3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}
