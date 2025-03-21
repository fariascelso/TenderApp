// modalContentInjector.js
import { applyInputMasks } from '../utils/inputMasks.js'
import { saveClientToFirestore, saveCompanyToFirestore, saveEquipmentToFirestore, saveServiceToFirestore } from '../firebase/firestoreOperations.js'

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
        // Formulário fixo para cadastrar materiais
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
        // Formulário fixo para cadastrar serviços
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
        // Para outros casos (clientes, empresas), usa o conteúdo clonado
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

async function saveModalData(targetId) {
    try {
        if (targetId === 'clientModalContent') {
            await saveClientToFirestore()
        } else if (targetId === 'companyModalContent') {
            await saveCompanyToFirestore()
        } else if (targetId === 'equipmentModalContent') {
            await saveEquipmentToFirestore()
        } else if (targetId === 'serviceModalContent') {
            await saveServiceToFirestore()
        }
        alert('Dados salvos com sucesso!')
        const modal = document.getElementById(targetId).closest('.modal')
        modal.classList.remove('show')
        setTimeout(() => {
            modal.style.display = 'none'
        }, 300)
    } catch (error) {
        console.error('Erro ao salvar dados:', error)
        alert('Erro ao salvar dados. Veja o console para mais detalhes.')
    }
}