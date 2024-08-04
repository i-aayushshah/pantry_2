import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyAu9KHlpJnfxDNhPmpXbrFreGdqY6Jtu04",
    authDomain: "pantry-manager-9e3e9.firebaseapp.com",
    databaseURL: "https://pantry-manager-9e3e9-default-rtdb.firebaseio.com",
    projectId: "pantry-manager-9e3e9",
    storageBucket: "pantry-manager-9e3e9.appspot.com",
    messagingSenderId: "261631462509",
    appId: "1:261631462509:web:be380afed354861ed38364",
    measurementId: "G-E9J77GEB7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
