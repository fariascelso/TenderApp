// listServices.js
import { db, auth } from '../firebase/firebaseConfig.js'
import { checkAuthState } from '../features/auth.js'
import { 
    collection, 
    getDocs, 
    doc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { injectModalContentForEdit } from '../modals/modalContentInjector.js'

function getCurrentUserId() {
    const user = auth.currentUser
    if (!user) throw new Error("Usuário não está autenticado.")
    return user.uid
}

function getUserCollection(collectionName) {
    const userId = getCurrentUserId()
    return collection(db, "users", userId, collectionName)
}

function getUserDoc(collectionName, docId) {
    const userId = getCurrentUserId()
    return doc(db, "users", userId, collectionName, docId)
}

async function loadServices() {
    const servicesTableBody = document.querySelector('#servicesTable tbody')
    if (!servicesTableBody) {
        console.error('Elemento #servicesTable tbody não encontrado.')
        return
    }

    try {
        const querySnapshot = await getDocs(getUserCollection('servicos'))
        servicesTableBody.innerHTML = ''

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${data.descriptionService || 'N/A'}</td>
                <td>${data.amountService || 'N/A'}</td>
                <td>
                    <button class="view-btn" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            `
            servicesTableBody.appendChild(row)
        })

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => viewService(btn.dataset.id))
        })
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editService(btn.dataset.id))
        })
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteService(btn.dataset.id))
        })
    } catch (error) {
        console.error('Erro ao carregar serviços:', error)
        alert('Erro ao carregar serviços.')
    }
}

function viewService(id) {
    window.location.href = `../index.html?id=${id}&mode=view&type=service`
}

function editService(id) {
    // Abre o modal de serviço e passa o ID para edição
    const modal = document.getElementById('serviceModal')
    if (modal) {
        injectModalContentForEdit('services-container', 'serviceModalContent', id)
        modal.classList.add('show')
        modal.style.display = 'flex'
    } else {
        console.error('Modal de serviço não encontrado.')
    }
}

async function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            await deleteDoc(getUserDoc('servicos', id))
            alert('Serviço excluído com sucesso!')
            loadServices()
        } catch (error) {
            console.error('Erro ao excluir serviço:', error)
            alert('Erro ao excluir serviço.')
        }
    }
}

export { loadServices, viewService, editService, deleteService }

window.onload = function() {
    checkAuthState(true, () => {
        loadServices()
    })
}