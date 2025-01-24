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

async function loadMaterials() {
    const materialsTableBody = document.querySelector('#materialsTable tbody')
    if (!materialsTableBody) {
        console.error('Elemento #materialsTable tbody não encontrado.')
        return
    }

    try {
        const querySnapshot = await getDocs(getUserCollection('equipamentos'))
        materialsTableBody.innerHTML = ''

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${data.codeEquipment || 'N/A'}</td>
                <td>${data.nameEquipment || 'N/A'}</td>
                <td>${data.unitPriceEquipment || 'N/A'}</td>
                <td>
                    <button class="view-btn" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            `
            materialsTableBody.appendChild(row)
        })

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => viewMaterial(btn.dataset.id))
        })
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editMaterial(btn.dataset.id))
        })
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteMaterial(btn.dataset.id))
        })
    } catch (error) {
        console.error('Erro ao carregar Material:', error)
        alert('Erro ao carregar Material.')
    }
}

function viewMaterial(id) {
    window.location.href = `../index.html?id=${id}&mode=view&type=material`
}

function editMaterial(id) {
    const modal = document.getElementById('materialModal')
    if (modal) {
        injectModalContentForEdit('equipments-container"', 'materialModalContent', id)
        modal.classList.add('show')
        modal.style.display = 'flex'
    } else {
        console.error('Modal de material não encontrado.')
    }
}

async function deleteMaterial(id) {
    if (confirm('Tem certeza que deseja excluir este material?')) {
        try {
            await deleteDoc(getUserDoc('equipamentos', id))
            alert('Material excluído com sucesso!')
            loadMaterials()
        } catch (error) {
            console.error('Erro ao excluir material:', error)
            alert('Erro ao excluir material.')
        }
    }
}

export { loadMaterials, viewMaterial, editMaterial, deleteMaterial }

window.onload = function() {
    checkAuthState(true, () => {
        loadMaterials()
    })
}