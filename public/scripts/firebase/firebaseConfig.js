import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBEjIDlgVTfO425_9gZZ4JiIuvKA8Ab64I",
    authDomain: "criarproposta.firebaseapp.com",
    projectId: "criarproposta",
    storageBucket: "criarproposta.firebasestorage.app",
    messagingSenderId: "1029025542577",
    appId: "1:1029025542577:web:f293d8c8d15b168f9d8d90"
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

export { app, auth, db }