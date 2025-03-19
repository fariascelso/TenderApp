import { 
    loadClients, 
    loadCompanies, 
    loadEquipments, 
    loadServices, 
    saveDataToFirestore, 
    updateDataToFirestore, 
    deleteOrcamento, 
    loadOrcamentoForEdit, 
    loadClientForEdit, 
    updateClientToFirestore 
} from './firebase/firestoreOperations.js'
import { applyInputMasks } from './utils/inputMasks.js'
import { editOrcamento, viewOrcamento, deleteClient, editClient } from './tables/tableHandlers.js'
import { generatePDFWithLogo, handleLogoUpload } from './pdf.js'
import { fillEquipmentData, fillServiceData } from './equipmentsAndServices.js'
import { fillCompanyData, fillClientData } from './formHandlers.js'
import { navigateToListarOrcamentos, navigateToCriarOrcamento } from './navigation.js'

const App = {
    saveDataToFirestore,
    generatePDFWithLogo,
    handleLogoUpload,
    loadEquipments,
    loadServices,
    fillEquipmentData,
    fillServiceData,
    fillCompanyData,
    fillClientData,
    updateClientToFirestore,
    updateDataToFirestore,
    editOrcamento,
    viewOrcamento,
    deleteOrcamento,
    navigateToListarOrcamentos,
    navigateToCriarOrcamento,
    editClient,
    deleteClient
}

window.App = App

async function init() {
    try {

        const clients = await loadClients()
        const companies = await loadCompanies()
        const equipments = await loadEquipments()
        const services = await loadServices()
        console.log("Todos os dados foram carregados com sucesso.")

        populateClientSelect(clients)
        populateCompanySelect(companies)
        populateEquipmentSelect(equipments)
        populateServiceSelect(services)
        setupEquipmentListeners()

        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        const type = urlParams.get('type')
        const viewMode = urlParams.get('view') === 'true'

        if (id && type === 'client') {
            await loadClientForEdit(id)
            if (viewMode) {
                const inputs = document.querySelectorAll('input, textarea, select')
                inputs.forEach(input => {
                    input.disabled = true
                })
                const saveButton = document.querySelector('.button-container button:first-child')
                if (saveButton) saveButton.style.display = 'none'
            }
        } else if (id && type === 'orcamento') {
            await loadOrcamentoForEdit(id)
            if (viewMode) {
                const inputs = document.querySelectorAll('input, textarea, select')
                inputs.forEach(input => {
                    input.disabled = true
                })
                const saveButton = document.querySelector('.button-container button:first-child')
                if (saveButton) saveButton.style.display = 'none'
            }
        }
    } catch (error) {
        console.error("Erro ao inicializar:", error)
    }
}

function populateClientSelect(clients) {
    const clientSelect = document.getElementById('clientSelect')
    if (!clientSelect) {
        console.warn('Elemento #clientSelect não encontrado.')
        return
    }

    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>'
    clients.forEach(client => {
        const option = document.createElement('option')
        option.value = JSON.stringify(client)
        option.textContent = client.nameClient || 'Cliente sem nome'
        clientSelect.appendChild(option)
    })
}

function populateCompanySelect(companies) {
    const companySelect = document.getElementById('companySelect')
    if (!companySelect) {
        console.warn('Elemento #companySelect não encontrado.')
        return
    }

    companySelect.innerHTML = '<option value="">Selecione uma empresa</option>'
    companies.forEach(company => {
        const option = document.createElement('option')
        option.value = JSON.stringify(company)
        option.textContent = company.nomeEmpresa || 'Empresa sem nome'
        companySelect.appendChild(option)
    })
}

function populateEquipmentSelect(equipments) {
    const equipmentSelect = document.getElementById('equipmentSelect')
    if (!equipmentSelect) {
        console.warn('Elemento #equipmentSelect não encontrado.')
        return
    }

    equipmentSelect.innerHTML = '<option value="">Selecione um equipamento</option>'
    equipments.forEach(equipment => {
        const option = document.createElement('option')
        option.value = JSON.stringify(equipment)
        option.textContent = `${equipment.codeEquipment || ''} - ${equipment.nameEquipment || 'Equipamento sem nome'}`
        equipmentSelect.appendChild(option)
    })
}

function populateServiceSelect(services) {
    const serviceSelect = document.getElementById('serviceSelect')
    if (!serviceSelect) {
        console.warn('Elemento #serviceSelect não encontrado.')
        return
    }

    serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>'
    services.forEach(service => {
        const option = document.createElement('option')
        option.value = JSON.stringify(service)
        option.textContent = service.descriptionService || 'Serviço sem descrição'
        serviceSelect.appendChild(option)
    })
}

function calculateSubtotal(equipmentItem) {
    const quantityInput = equipmentItem.querySelector('.quantityEquipment')
    const unitPriceInput = equipmentItem.querySelector('.unitPriceEquipment')
    const subtotalInput = equipmentItem.querySelector('.subtotalEquipment')

    let quantity = parseInt(quantityInput.value) || 0
    let unitPrice = unitPriceInput.value.replace(/[^\d,]/g, '').replace(',', '.')
    unitPrice = parseFloat(unitPrice) || 0

    const subtotal = quantity * unitPrice

    subtotalInput.value = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function setupEquipmentListeners() {
    const equipmentsContainer = document.getElementById('equipments-container')
    if (!equipmentsContainer) return

    function setupItemListeners(equipmentItem) {
        const quantityInput = equipmentItem.querySelector('.quantityEquipment')
        const unitPriceInput = equipmentItem.querySelector('.unitPriceEquipment')

        quantityInput.addEventListener('input', () => calculateSubtotal(equipmentItem))
        unitPriceInput.addEventListener('input', () => calculateSubtotal(equipmentItem))

        applyInputMasks(equipmentItem)
    }

    const equipmentItems = equipmentsContainer.querySelectorAll('.equipment-item')
    equipmentItems.forEach(setupItemListeners)

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('equipment-item')) {
                        setupItemListeners(node)
                    }
                })
            }
        })
    })

    observer.observe(equipmentsContainer, { childList: true })
}

const includeEquipmentsCheckbox = document.getElementById('includeEquipments')
const materialsBtn = document.getElementById('materials-btn')
const equipmentsPanel = document.getElementById('equipments-panel')

if (includeEquipmentsCheckbox && materialsBtn && equipmentsPanel) {
    includeEquipmentsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            materialsBtn.style.display = 'block'
            if (!materialsBtn.classList.contains('active')) {
                materialsBtn.click()
            }
        } else {
            materialsBtn.style.display = 'none'
            materialsBtn.classList.remove('active')
            equipmentsPanel.style.display = 'none'
        }
    })
} else {
    console.warn('Checkbox de equipamentos ou elementos relacionados não encontrados.')
}

window.onload = init