// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCUKvySeJAOQtPsiCB0bj2dvSncMRH-Tss",
  authDomain: "cardistrylog-2aa82.firebaseapp.com",
  projectId: "cardistrylog-2aa82",
  storageBucket: "cardistrylog-2aa82.firebasestorage.app",
  messagingSenderId: "507693113104",
  appId: "1:507693113104:web:26f4ecc7943c5bb0940f95",
  measurementId: "G-ZLTC3C2CME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const provider = new GoogleAuthProvider();

export default app;