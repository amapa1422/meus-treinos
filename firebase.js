import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyD1V3SMYQqvqrYsEFPPEXvvIbrOpFSES4M",
  authDomain: "meus-treinos-2baa0.firebaseapp.com",
  projectId: "meus-treinos-2baa0",
  storageBucket: "meus-treinos-2baa0.firebasestorage.app",
  messagingSenderId: "64734307257",
  appId: "1:64734307257:web:97e5afa8ea69c884fdcc68"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


export {

    auth,
    db,

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot

};