import { db } from '../firebase/firebaseConfig.js'

async function loadOrcamentos() {
    const orcamentosTableBody = document.querySelector('#orcamentosTable tbody')
    if (!orcamentosTableBody) {
        console.error('Elemento #orcamentosTable tbody não encontrado.')
        return
    }

    try {
        const querySnapshot = await db.collection('orcamentos').get()
        orcamentosTableBody.innerHTML = ''

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${data.numericId || 'N/A'}</td>
                <td>${data.cliente?.nameClient || 'N/A'}</td>
                <td>${data.empresa?.nomeEmpresa || 'N/A'}</td>
                <td>${data.dataCriacao ? data.dataCriacao.toDate().toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="view-btn" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            `
            orcamentosTableBody.appendChild(row)
        })

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => viewOrcamento(btn.dataset.id))
        })
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editOrcamento(btn.dataset.id))
        })
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteOrcamento(btn.dataset.id))
        })
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error)
    }
}

function viewOrcamento(id) {
    window.location.href = `../index.html?id=${id}&view=true`
}

function editOrcamento(id) {
    window.location.href = `../index.html?id=${id}`
}

async function deleteOrcamento(id) {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        try {
            await db.collection('orcamentos').doc(id).delete()
            loadOrcamentos()
        } catch (error) {
            console.error('Erro ao excluir orçamento:', error)
        }
    }
}

export { loadOrcamentos, viewOrcamento, editOrcamento, deleteOrcamento }

window.onload = function() {
    loadOrcamentos()
}