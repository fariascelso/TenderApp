import { auth } from '../firebase/firebaseConfig.js'
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm')
    const errorMessage = document.getElementById('errorMessage')
    const forgotPasswordLink = document.getElementById('forgotPasswordLink')
    const resetPasswordForm = document.getElementById('resetPasswordForm')
    const resetModalClose = document.querySelector('#resetPasswordModal .close')

    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = '../index.html'
        } else {
            console.log('Usuário não autenticado, mostrando página de login')
        }
    })

    if (loginForm) {
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

                window.location.href = '../index.html'
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
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault()
            const resetModal = document.getElementById('resetPasswordModal')
            if (resetModal) {
                resetModal.style.display = 'flex'
                setTimeout(() => resetModal.classList.add('show'), 0)
            }
        })
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const email = document.getElementById('resetEmail').value.trim()
            const resetModal = document.getElementById('resetPasswordModal')

            try {
                await sendPasswordResetEmail(auth, email)
                alert('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.')
                resetModal.classList.remove('show')
                setTimeout(() => resetModal.style.display = 'none', 300)
            } catch (error) {
                errorMessage.textContent = error.code === 'auth/invalid-email'
                    ? 'E-mail inválido.'
                    : error.code === 'auth/user-not-found'
                        ? 'Nenhum usuário encontrado com este e-mail.'
                        : 'Erro ao enviar e-mail de redefinição. Tente novamente.'
                console.error('Erro ao enviar e-mail de redefinição:', error)
            }
        })
    }

    if (resetModalClose) {
        resetModalClose.addEventListener('click', () => {
            const resetModal = document.getElementById('resetPasswordModal')
            resetModal.classList.remove('show')
            setTimeout(() => resetModal.style.display = 'none', 300)
        })
    }

    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('password')
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordInput.setAttribute('type', type)
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>'
    })
})