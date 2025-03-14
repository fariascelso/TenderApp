import { db } from '../firebase/firebaseConfig.js'

async function loadClients() {
    const clientsTableBody = document.querySelector('#clientsTable tbody')
    if (!clientsTableBody) {
        console.error('Elemento #clientsTable tbody não encontrado.')
        return
    }

    try {
        const querySnapshot = await db.collection('clientes').get()
        clientsTableBody.innerHTML = ''

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${data.nameClient || 'N/A'}</td>
                <td>${data.cpfCNPJClient || 'N/A'}</td>
                <td>${data.phoneClient || 'N/A'}</td>
                <td>${data.emailClient || 'N/A'}</td>
                <td>
                    <button class="view-btn" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            `
            clientsTableBody.appendChild(row)
        })

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => viewClient(btn.dataset.id))
        })
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editClient(btn.dataset.id))
        })
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteClient(btn.dataset.id))
        })
    } catch (error) {
        console.error('Erro ao carregar clientes:', error)
        alert('Erro ao carregar clientes. Veja o console para mais detalhes.')
    }
}

function viewClient(id) {
    window.location.href = `../index.html?id=${id}&view=true&type=client`
}

function editClient(id) {
    window.location.href = `../index.html?id=${id}&type=client`
}

async function deleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            await db.collection('clientes').doc(id).delete()
            alert('Cliente excluído com sucesso!')
            loadClients()
        } catch (error) {
            console.error('Erro ao excluir cliente:', error)
            alert('Erro ao excluir cliente. Veja o console para mais detalhes.')
        }
    }
}

export { loadClients, viewClient, editClient, deleteClient }

window.onload = function() {
    loadClients()
}