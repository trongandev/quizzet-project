import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDNhSx1kLWG_A5XwYvxVdeei50S9G4LPfY",
    authDomain: "quiz-9fe46.firebaseapp.com",
    projectId: "quiz-9fe46",
    storageBucket: "quiz-9fe46.appspot.com",
    messagingSenderId: "753918327545",
    appId: "1:753918327545:web:d97f5500ef1ec187038028",
    measurementId: "G-3QJSGGCKQ6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
