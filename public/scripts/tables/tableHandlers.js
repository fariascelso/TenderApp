import { db, auth } from '../firebase/firebaseConfig.js'
import { loadOrcamentos, loadClients } from '../firebase/firestoreOperations.js'

function getCurrentUserId() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Usuário não está autenticado.");
    }
    return user.uid;
}

function getUserDoc(collectionName, docId) {
    const userId = getCurrentUserId()
    return doc(db, "users", userId, collectionName, docId)
}

export function editOrcamento(id) {
    window.location.href = `../index.html?id=${id}`
}

export function viewOrcamento(id) {
    window.location.href = `details.html?id=${id}`
}

export function editClient(id) {
    window.location.href = `../index.html?clientId=${id}`
}

export async function deleteClient(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        try {
            await deleteDoc(getUserDoc("clientes", id))
            alert("Cliente excluído com sucesso!")
            loadClients()
        } catch (error) {
            console.error("Erro ao excluir cliente:", error)
            alert("Erro ao excluir cliente.")
        }
    }
}

if (window.location.pathname.includes("listorders.html")) {
    window.onload = function() {
        checkAuthState(true, () => {
            loadOrcamentos()
        })
    }
}

if (window.location.pathname.includes("listclients.html")) {
    window.onload = function() {
        checkAuthState(true, () => {
            loadClients()
        })
    }
}