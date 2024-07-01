import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
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
const auth = getAuth(app);
// Initialize Firebase Authentication and get a reference to the service
if (window.location.hostname === "localhost") {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
}

export { db, auth };
export default app;
