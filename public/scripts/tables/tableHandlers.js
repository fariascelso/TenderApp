import { db } from '../firebase/firebaseConfig.js'
import { loadOrcamentos, loadClients } from '../firebase/firestoreOperations.js'

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
            await db.collection("clientes").doc(id).delete()
            alert("Cliente excluído com sucesso!")
            loadClients()
        } catch (error) {
            console.error("Erro ao excluir cliente:", error)
            alert("Erro ao excluir cliente.")
        }
    }
}

if (window.location.pathname.includes("listorders.html")) {
    window.onload = loadOrcamentos
}

if (window.location.pathname.includes("listclients.html")) {
    window.onload = loadClients
}