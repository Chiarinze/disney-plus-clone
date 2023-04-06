import { initializeApp } from "firebase/app";
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCdBvYU8bp0nAGmIPlyIy_t8AuFhO5EJGY",
  authDomain: "disney-plus-clone-4eaa6.firebaseapp.com",
  projectId: "disney-plus-clone-4eaa6",
  storageBucket: "disney-plus-clone-4eaa6.appspot.com",
  messagingSenderId: "872731260517",
  appId: "1:872731260517:web:990c7e44650d03ed82f88c",
  measurementId: "G-6EFLR0QPV6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);


export { auth, signOut, provider, storage, signInWithPopup, collection, onSnapshot, doc, getDoc };
export default db;