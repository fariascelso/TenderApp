import { auth, db } from '../firebase/firebaseConfig.js'
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm')
    const errorMessage = document.getElementById('errorMessage')

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const name = document.getElementById('name').value.trim()
        const username = document.getElementById('username').value.trim()
        const email = document.getElementById('email').value.trim()
        const password = document.getElementById('password').value.trim()
        const confirmPassword = document.getElementById('confirmPassword').value.trim()

        errorMessage.textContent = ''

        if (!name || !username || !email || !password || !confirmPassword) {
            errorMessage.textContent = 'Por favor, preencha todos os campos.'
            return
        }

        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Por favor, insira um e-mail válido.'
            return
        }

        if (password.length < 6) {
            errorMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.'
            return
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = 'As senhas não coincidem.'
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await sendEmailVerification(user)
            alert('Usuário criado com sucesso! Um e-mail de verificação foi enviado.')

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                username: username,
                email: email,
                createdAt: new Date()
            })

            window.location.href = 'login.html'
        } catch (error) {
            errorMessage.textContent = error.message || 'Erro ao criar usuário.'
            console.error('Erro ao criar usuário:', error)
        }
    })

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }
})