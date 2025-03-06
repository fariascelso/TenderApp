// scripts/firebase/firebaseConfig.js
const firebaseConfig = {
    apiKey: "AIzaSyBEjIDlgVTfO425_9gZZ4JiIuvKA8Ab64I",
    authDomain: "criarproposta.firebaseapp.com",
    projectId: "criarproposta",
    storageBucket: "criarproposta.firebasestorage.app",
    messagingSenderId: "1029025542577",
    appId: "1:1029025542577:web:f293d8c8d15b168f9d8d90"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };