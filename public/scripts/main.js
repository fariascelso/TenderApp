import { logout, checkAuthState } from './features/auth.js'
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

let currentNumericId = null

const App = {
    saveDataToFirestore: async () => {
        const numericId = await saveDataToFirestore()
        currentNumericId = numericId
        generatePDFWithLogo(currentNumericId)
        return numericId
    },
    generatePDFWithLogo: () => {
        generatePDFWithLogo(currentNumericId)
    },
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
    checkAuthState(true, async (user) => {
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

            // Inicializar visibilidade dos botões e painéis
            initializeVisibility()

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

            const logoutBtn = document.getElementById('logout-btn')
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    if (confirm('Tem certeza que deseja sair?')) {
                        logout()
                    }
                })
            }
        } catch (error) {
            console.error("Erro ao inicializar:", error)
        }
    })
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

// Função para atualizar a visibilidade dos botões e painéis
function updateVisibility(checkbox, btn, panel) {
    if (checkbox.checked) {
        btn.style.display = 'block'
        if (!btn.classList.contains('active')) {
            btn.click()
        }
    } else {
        btn.style.display = 'none'
        btn.classList.remove('active')
        panel.style.display = 'none'
    }
}

// Função para inicializar a visibilidade com base no estado inicial dos checkboxes
function initializeVisibility() {
    const includeServicesCheckbox = document.getElementById('includeServices')
    const servicesBtn = document.getElementById('services-btn')
    const servicesPanel = document.getElementById('services-panel')

    const includeEquipmentsCheckbox = document.getElementById('includeEquipments')
    const materialsBtn = document.getElementById('materials-btn')
    const equipmentsPanel = document.getElementById('equipments-panel')

    if (includeServicesCheckbox && servicesBtn && servicesPanel) {
        updateVisibility(includeServicesCheckbox, servicesBtn, servicesPanel)
        includeServicesCheckbox.addEventListener('change', () => {
            updateVisibility(includeServicesCheckbox, servicesBtn, servicesPanel)
        })
    } else {
        console.warn('Checkbox de serviços ou elementos relacionados não encontrados.')
    }

    if (includeEquipmentsCheckbox && materialsBtn && equipmentsPanel) {
        updateVisibility(includeEquipmentsCheckbox, materialsBtn, equipmentsPanel)
        includeEquipmentsCheckbox.addEventListener('change', () => {
            updateVisibility(includeEquipmentsCheckbox, materialsBtn, equipmentsPanel)
        })
    } else {
        console.warn('Checkbox de equipamentos ou elementos relacionados não encontrados.')
    }
}

window.onload = init