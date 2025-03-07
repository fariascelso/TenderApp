// scripts/modals/modalContentInjector.js
import { applyInputMasks } from '../utils/inputMasks.js';
import { saveClientToFirestore, saveCompanyToFirestore, saveEquipmentToFirestore, saveServiceToFirestore } from '../firebase/firestoreOperations.js';

export function injectModalContent(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);

    console.log(`Tentando injetar conteúdo de ${sourceId} para ${targetId}`);
    if (sourceElement && targetElement) {
        console.log(`Elementos encontrados: ${sourceId} e ${targetId}`);
        const clonedContent = sourceElement.cloneNode(true);
        console.log('Conteúdo clonado:', clonedContent.innerHTML);

        clonedContent.classList.remove('panel');
        clonedContent.id = '';

        if (targetId === 'clientModalContent') {
            const clientSelectLabel = clonedContent.querySelector('label[for="clientSelect"]');
            const clientSelect = clonedContent.querySelector('#clientSelect');
            if (clientSelectLabel) clientSelectLabel.remove();
            if (clientSelect) clientSelect.remove();
        } else if (targetId === 'companyModalContent') {
            const companySelectLabel = clonedContent.querySelector('label[for="companySelect"]');
            const companySelect = clonedContent.querySelector('#companySelect');
            if (companySelectLabel) companySelectLabel.remove();
            if (companySelect) companySelect.remove();
        } else if (targetId === 'equipmentModalContent') {
            const addEquipmentBtn = clonedContent.querySelector('#add-equipment-btn');
            if (addEquipmentBtn) addEquipmentBtn.remove();
            const quantityLabel = clonedContent.querySelector('label[for="quantityEquipment"]');
            const quantityInput = clonedContent.querySelector('.quantityEquipment');
            if (quantityLabel) quantityLabel.remove();
            if (quantityInput) quantityInput.remove();
            const subtotalLabel = clonedContent.querySelector('label[for="subtotalEquipment"]');
            const subtotalInput = clonedContent.querySelector('.subtotalEquipment');
            if (subtotalLabel) subtotalLabel.remove();
            if (subtotalInput) subtotalInput.remove();
        } else if (targetId === 'serviceModalContent') {
            const addServiceBtn = clonedContent.querySelector('#add-service-btn');
            if (addServiceBtn) addServiceBtn.remove();
        }

        targetElement.innerHTML = '';
        targetElement.appendChild(clonedContent);

        applyInputMasks(targetElement);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar';
        saveButton.className = 'modal-save-btn';
        saveButton.addEventListener('click', () => saveModalData(targetId));
        targetElement.appendChild(saveButton);
        console.log('Conteúdo após injeção:', targetElement.innerHTML);
    } else {
        console.error(`Elemento ${sourceId} ou ${targetId} não encontrado.`);
    }
}

async function saveModalData(targetId) {
    try {
        if (targetId === 'clientModalContent') {
            await saveClientToFirestore();
        } else if (targetId === 'companyModalContent') {
            await saveCompanyToFirestore();
        } else if (targetId === 'equipmentModalContent') {
            await saveEquipmentToFirestore();
        } else if (targetId === 'serviceModalContent') {
            await saveServiceToFirestore();
        }
        alert('Dados salvos com sucesso!');
        const modal = document.getElementById(targetId).closest('.modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        alert('Erro ao salvar dados. Veja o console para mais detalhes.');
    }
}