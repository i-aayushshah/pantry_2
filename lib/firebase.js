import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyDQPPMmdOWccn7qFYVLhVf69Eyyl19RtYU",
  authDomain: "pantry-b020a.firebaseapp.com",
  projectId: "pantry-b020a",
  storageBucket: "pantry-b020a.appspot.com",
  messagingSenderId: "1034219787517",
  appId: "1:1034219787517:web:142ebd6d3f6f27b4ef1a94",
  measurementId: "G-C7B41R30VR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
