/* =====================================================
   FIREBASE - MEUS TREINOS
===================================================== */


/* =====================================================
   FIREBASE APP
===================================================== */

import {
    initializeApp,
    getApps,
    getApp
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


/* =====================================================
   FIREBASE AUTHENTICATION
===================================================== */

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* =====================================================
   FIRESTORE
===================================================== */

import {
    getFirestore,

    collection,
    doc,

    setDoc,
    updateDoc,
    deleteDoc,

    getDoc,
    getDocs,

    onSnapshot,

    query,
    orderBy,
    limit,

    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";



/* =====================================================
   CONFIGURAÇÃO DO SEU FIREBASE
===================================================== */

/*
    IMPORTANTE:

    Substitua SOMENTE este firebaseConfig
    pelo que aparece no Firebase Console:

    Configurações do projeto
    → Geral
    → Seus apps
    → Meus Treinos Web
*/

const firebaseConfig = {
  apiKey: "AIzaSyD1V3SMYQqvqrYsEFPPEXvvIbrOpFSES4M",
  authDomain: "meus-treinos-2baa0.firebaseapp.com",
  projectId: "meus-treinos-2baa0",
  storageBucket: "meus-treinos-2baa0.firebasestorage.app",
  messagingSenderId: "64734307257",
  appId: "1:64734307257:web:97e5afa8ea69c884fdcc68"
};



/* =====================================================
   INICIALIZAÇÃO
===================================================== */

/*
    Evita inicializar o Firebase duas vezes
    caso o arquivo seja importado novamente.
*/

const app =
    getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig);



/* =====================================================
   AUTH
===================================================== */

const auth =
    getAuth(app);



/* =====================================================
   FIRESTORE
===================================================== */

const db =
    getFirestore(app);



/* =====================================================
   EXPORTAÇÕES
===================================================== */

export {

    /* APP */

    app,


    /* AUTH */

    auth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,


    /* FIRESTORE */

    db,

    collection,

    doc,

    setDoc,

    updateDoc,

    deleteDoc,

    getDoc,

    getDocs,

    onSnapshot,

    query,

    orderBy,

    limit,

    serverTimestamp

};