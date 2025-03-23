// modalContentInjector.js
import { applyInputMasks } from '../utils/inputMasks.js'
import { saveClientToFirestore, saveCompanyToFirestore, saveEquipmentToFirestore, saveServiceToFirestore, updateServiceToFirestore } from '../firebase/firestoreOperations.js'
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js" // Adicione esta linha
import { db, auth } from '../firebase/firebaseConfig.js' // Adicione para db e auth

export function injectModalContent(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId)
    const targetElement = document.getElementById(targetId)

    console.log(`Tentando injetar conteúdo de ${sourceId} para ${targetId}`)
    if (!sourceElement || !targetElement) {
        console.error(`Elemento ${sourceId} ou ${targetId} não encontrado.`)
        return
    }

    let contentToInject

    if (targetId === 'equipmentModalContent') {
        contentToInject = document.createElement('div')
        contentToInject.innerHTML = `
            <div class="equipment-item">
                <div class="field-group code-name">
                    <label for="codeEquipment">Código:</label>
                    <input type="text" class="codeEquipment" placeholder="Código do equipamento">
                </div>
                <div class="field-group code-name">
                    <label for="nameEquipment">Descrição:</label>
                    <input type="text" class="nameEquipment" placeholder="Nome do equipamento">
                </div>
                <div class="field-group quantity-price-subtotal">
                    <label for="unitPriceEquipment">Valor Unitário:</label>
                    <input type="text" class="unitPriceEquipment" placeholder="Preço unitário">
                </div>
            </div>
        `
    } else if (targetId === 'serviceModalContent') {
        contentToInject = document.createElement('div')
        contentToInject.innerHTML = `
            <div class="service-item">
                <div class="field-group">
                    <label for="descriptionService">Descrição do Serviço:</label>
                    <input type="text" class="descriptionService" placeholder="Descrição do serviço">
                </div>
                <div class="field-group">
                    <label for="amountService">Valor:</label>
                    <input type="text" class="amountService" placeholder="Valor do serviço">
                </div>
            </div>
        `
    } else {
        contentToInject = sourceElement.cloneNode(true)
        contentToInject.classList.remove('panel')
        contentToInject.id = ''

        if (targetId === 'clientModalContent') {
            const clientSelectLabel = contentToInject.querySelector('label[for="clientSelect"]')
            const clientSelect = contentToInject.querySelector('#clientSelect')
            if (clientSelectLabel) clientSelectLabel.remove()
            if (clientSelect) clientSelect.remove()
        } else if (targetId === 'companyModalContent') {
            const companySelectLabel = contentToInject.querySelector('label[for="companySelect"]')
            const companySelect = contentToInject.querySelector('#companySelect')
            if (companySelectLabel) companySelectLabel.remove()
            if (companySelect) companySelect.remove()
        }
    }

    targetElement.innerHTML = ''
    targetElement.appendChild(contentToInject)

    applyInputMasks(targetElement)

    const saveButton = document.createElement('button')
    saveButton.textContent = 'Salvar'
    saveButton.className = 'modal-save-btn'
    saveButton.addEventListener('click', () => saveModalData(targetId))
    targetElement.appendChild(saveButton)

    console.log('Conteúdo após injeção:', targetElement.innerHTML)
}

export async function injectModalContentForEdit(sourceId, targetId, docId) {
    const targetElement = document.getElementById(targetId)
    if (!targetElement) {
        console.error(`Elemento ${targetId} não encontrado.`)
        return
    }

    let contentToInject = document.createElement('div')

    if (targetId === 'serviceModalContent') {
        try {
            const serviceDoc = await getDoc(getUserDoc('servicos', docId))
            if (serviceDoc.exists()) {
                const data = serviceDoc.data()
                contentToInject.innerHTML = `
                    <div class="service-item">
                        <div class="field-group">
                            <label for="descriptionService">Descrição do Serviço:</label>
                            <input type="text" class="descriptionService" value="${data.descriptionService || ''}" placeholder="Descrição do serviço">
                        </div>
                        <div class="field-group">
                            <label for="amountService">Valor:</label>
                            <input type="text" class="amountService" value="${data.amountService || ''}" placeholder="Valor do serviço">
                        </div>
                    </div>
                `
            } else {
                console.error(`Serviço com ID ${docId} não encontrado.`)
                alert('Serviço não encontrado.')
                return
            }
        } catch (error) {
            console.error('Erro ao carregar serviço para edição:', error)
            alert('Erro ao carregar serviço.')
            return
        }
    }

    targetElement.innerHTML = ''
    targetElement.appendChild(contentToInject)

    applyInputMasks(targetElement)

    const saveButton = document.createElement('button')
    saveButton.textContent = 'Salvar Alterações'
    saveButton.className = 'modal-save-btn'
    saveButton.addEventListener('click', () => saveModalData(targetId, docId))
    targetElement.appendChild(saveButton)
}

function getUserDoc(collectionName, docId) {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error("Usuário não autenticado.")
    return doc(db, "users", userId, collectionName, docId)
}

async function saveModalData(targetId, docId = null) {
    try {
        if (targetId === 'clientModalContent') {
            await saveClientToFirestore()
        } else if (targetId === 'companyModalContent') {
            await saveCompanyToFirestore()
        } else if (targetId === 'equipmentModalContent') {
            await saveEquipmentToFirestore()
        } else if (targetId === 'serviceModalContent') {
            if (docId) {
                await updateServiceToFirestore(docId)
            } else {
                await saveServiceToFirestore()
            }
        }
        alert('Dados salvos com sucesso!')
        const modal = document.getElementById(targetId).closest('.modal')
        modal.classList.remove('show')
        setTimeout(() => {
            modal.style.display = 'none'
        }, 300)

        if (targetId === 'serviceModalContent' && window.location.pathname.includes('listservices.html')) {
            window.location.reload()
        }
    } catch (error) {
        console.error('Erro ao salvar dados:', error)
        alert('Erro ao salvar dados.')
    }
}