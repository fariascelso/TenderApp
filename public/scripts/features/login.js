import { auth } from '../firebase/firebaseConfig.js'
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    const errorMessage = document.getElementById('errorMessage')

    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = 'details.html'
        } else {
            console.log('Usuário não autenticado, mostrando página de login')
        }
    })

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const email = document.getElementById('username').value.trim()
        const password = document.getElementById('password').value.trim()
        const loginButton = document.getElementById('loginButton')

        errorMessage.textContent = ''
        loginButton.disabled = true
        loginButton.innerHTML = 'Entrar <span class="spinner"></span>'

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (!user.emailVerified) {
                errorMessage.textContent = 'Por favor, verifique seu e-mail antes de fazer login.'
                loginButton.disabled = false
                loginButton.innerHTML = 'Entrar'
                return
            }

            window.location.href = 'details.html'
        } catch (error) {
            loginButton.disabled = false
            loginButton.innerHTML = 'Entrar'
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage.textContent = 'E-mail inválido.'
                    break
                case 'auth/user-disabled':
                    errorMessage.textContent = 'Este usuário foi desativado.'
                    break
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage.textContent = 'E-mail ou senha incorretos.'
                    break
                default:
                    errorMessage.textContent = 'Erro ao fazer login. Tente novamente.'
                    console.error('Erro ao fazer login:', error)
            }
        }
    })
})