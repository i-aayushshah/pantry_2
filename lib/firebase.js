import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyDo8ghU3ZZ5DRBHydt4KXd0LFHJkgCBkoM",
    authDomain: "pantry-management-e3abe.firebaseapp.com",
    projectId: "pantry-management-e3abe",
    storageBucket: "pantry-management-e3abe.appspot.com",
    messagingSenderId: "740684660399",
    appId: "1:740684660399:web:31a16428c7be3453505e5a",
    measurementId: "G-VL4LXFZC9T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
