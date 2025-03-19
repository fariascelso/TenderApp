import { auth } from '../firebase/firebaseConfig.js'
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

export async function logout() {
    try {
        await signOut(auth);
        console.log('Usuário deslogado com sucesso')
        window.location.href = 'pages/login.html'
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
        alert('Erro ao fazer logout. Tente novamente.')
    }
}

export function checkAuthState(redirectIfNotLoggedIn = true) {
    onAuthStateChanged(auth, (user) => {
        if (!user && redirectIfNotLoggedIn) {
            window.location.href = 'pages/login.html'
        } else if (user) {
            console.log('Usuário autenticado:', user.uid)
        }
    })
}