import { db, auth } from './firebaseConfig.js'
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    runTransaction, 
    increment, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { toggleButtonLoading } from '../utils/helpers.js'
import { applyInputMasks } from '../utils/inputMasks.js'

function getCurrentUserId() {
    const user = auth.currentUser
    if (!user) {
        throw new Error("Usuário não está autenticado.")
    }
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

export async function generateNumericId() {
    const userId = getCurrentUserId()
    const counterRef = doc(db, "users", userId, "counters", "orcamentoCounter")
    let numericId

    await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef)
        if (!counterDoc.exists()) {
            transaction.set(counterRef, { count: 1 })
            numericId = 1
        } else {
            const currentCount = counterDoc.data().count
            numericId = currentCount + 1
            transaction.update(counterRef, { count: numericId })
        }
    })

    return numericId
}

export async function saveDataToFirestore() {
    toggleButtonLoading('save-budget-btn', true)

    try {
        const numericId = await generateNumericId()

        const getValue = (id) => {
            const element = document.getElementById(id)
            return element ? element.value : ''
        }

        const getChecked = (id) => {
            const element = document.getElementById(id)
            return element ? element.checked : false
        }

        const issuingCompany = {
            nomeEmpresa: getValue('nameBusiness'),
            fantasyName: getValue('fantasyName'),
            cnpj: getValue('cpfCnpj'),
            endereco: getValue('address'),
            numero: getValue('numberAddress'),
            bairro: getValue('neighborhood'),
            estado: getValue('state'),
            cidade: getValue('city'),
            cep: getValue('zipcode'),
            telefone: getValue('phone'),
            email: getValue('email')
        }

        const clientFormData = {
            nameClient: getValue('nameClient'),
            cpfCNPJClient: getValue('cpfCNPJClient'),
            fantasyNameClient: getValue('fantasyNameClient'),
            streetClient: getValue('streetClient'),
            numberAddressClient: getValue('numberAddressClient'),
            stateClient: getValue('stateClient'),
            neighborhoodClient: getValue('neighborhoodClient'),
            cityClient: getValue('cityClient'),
            zipcodeClient: getValue('zipcodeClient'),
            phoneClient: getValue('phoneClient'),
            emailClient: getValue('emailClient')
        }

        const includeServices = getChecked('includeServices')
        const includeEquipments = getChecked('includeEquipments')

        let serviceData = []
        if (includeServices) {
            const descriptions = document.querySelectorAll('.descriptionService')
            const amounts = document.querySelectorAll('.amountService')
            for (let i = 0; i < descriptions.length; i++) {
                serviceData.push({
                    descriptionService: descriptions[i].value,
                    amountService: amounts[i].value
                })
            }
        }

        let equipmentData = []
        if (includeEquipments) {
            const codes = document.querySelectorAll('.codeEquipment')
            const names = document.querySelectorAll('.nameEquipment')
            const quantities = document.querySelectorAll('.quantityEquipment')
            const unitPrices = document.querySelectorAll('.unitPriceEquipment')
            const subtotals = document.querySelectorAll('.subtotalEquipment')
            for (let i = 0; i < codes.length; i++) {
                let unitPrice = unitPrices[i].value.replace(/[^\d,]/g, '').replace(',', '.')
                unitPrice = parseFloat(unitPrice) || 0
                let subtotal = subtotals[i].value.replace(/[^\d,]/g, '').replace(',', '.')
                subtotal = parseFloat(subtotal) || 0
                equipmentData.push({
                    codeEquipment: codes[i].value,
                    nameEquipment: names[i].value,
                    quantityEquipment: parseInt(quantities[i].value) || 0,
                    unitPriceEquipment: unitPrice,
                    subtotalEquipment: subtotal
                })
            }
        }

        const orcamento = {
            empresa: issuingCompany,
            cliente: clientFormData,
            servicos: serviceData,
            equipamentos: equipmentData,
            observacoes: getValue('observations'),
            dataCriacao: new Date(),
            numericId: numericId
        }

        await setDoc(doc(getUserCollection('orcamentos'), numericId.toString()), orcamento)

        alert(`Orçamento salvo com sucesso! ID do orçamento: ${numericId}`)
        return numericId
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e)
        alert("Erro ao salvar orçamento.")
        throw e
    } finally {
        toggleButtonLoading('save-budget-btn', false)
    }
}

export async function updateDataToFirestore(id) {
    const issuingCompany = {
        nomeEmpresa: document.getElementById('nameBusiness').value,
        fantasyName: document.getElementById('fantasyName').value,
        cnpj: document.getElementById('cpfCnpj').value,
        endereco: document.getElementById('address').value,
        numero: document.getElementById('numberAddress').value,
        bairro: document.getElementById('neighborhood').value,
        estado: document.getElementById('state').value,
        cidade: document.getElementById('city').value,
        cep: document.getElementById('zipcode').value,
        telefone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    }

    const clientFormData = {
        nameClient: document.getElementById('nameClient').value,
        cpfCNPJClient: document.getElementById('cpfCNPJClient').value,
        fantasyNameClient: document.getElementById('fantasyNameClient').value,
        streetClient: document.getElementById('streetClient').value,
        numberAddressClient: document.getElementById('numberAddressClient').value,
        stateClient: document.getElementById('stateClient').value,
        neighborhoodClient: document.getElementById('neighborhoodClient').value,
        cityClient: document.getElementById('cityClient').value,
        zipcodeClient: document.getElementById('zipcodeClient').value,
        phoneClient: document.getElementById('phoneClient').value,
        emailClient: document.getElementById('emailClient').value,
    }

    const serviceData = []
    const descriptions = document.querySelectorAll('.descriptionService')
    const amounts = document.querySelectorAll('.amountService')
    for (let i = 0; i < descriptions.length; i++) {
        serviceData.push({
            descriptionService: descriptions[i].value,
            amountService: amounts[i].value
        })
    }

    const equipmentData = []
    const codes = document.querySelectorAll('.codeEquipment')
    const names = document.querySelectorAll('.nameEquipment')
    const quantities = document.querySelectorAll('.quantityEquipment')
    const unitPrices = document.querySelectorAll('.unitPriceEquipment')
    const subtotals = document.querySelectorAll('.subtotalEquipment')
    for (let i = 0; i < codes.length; i++) {
        equipmentData.push({
            codeEquipment: codes[i].value,
            nameEquipment: names[i].value,
            quantityEquipment: quantities[i].value,
            unitPriceEquipment: unitPrices[i].value,
            subtotalEquipment: subtotals[i].value
        })
    }

    const observations = document.getElementById('observations').value

    const orcamento = {
        empresa: issuingCompany,
        cliente: clientFormData,
        servicos: serviceData,
        equipamentos: equipmentData,
        observacoes: observations,
        dataCriacao: new Date()
    }

    try {
        await updateDoc(getUserDoc('orcamentos', id), orcamento)
        alert(`Orçamento atualizado com sucesso! ID: ${id}`)
        window.location.href = "listorders.html"
    } catch (e) {
        console.error("Erro ao atualizar documento: ", e)
        alert("Erro ao atualizar orçamento.")
    }
}

export async function deleteOrcamento(id) {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
        try {
            await deleteDoc(getUserDoc('orcamentos', id))
            alert("Orçamento excluído com sucesso!")
        } catch (error) {
            console.error("Erro ao excluir orçamento:", error)
            alert("Erro ao excluir orçamento.")
        }
    }
}

export async function loadClients() {
    try {
        const querySnapshot = await getDocs(getUserCollection("clientes"))
        const clients = []
        querySnapshot.forEach((doc) => {
            clients.push({ id: doc.id, ...doc.data() })
        })
        console.log("Clientes carregados:", clients)
        return clients
    } catch (error) {
        console.error("Erro ao carregar clientes:", error)
        throw error
    }
}

export async function loadCompanies() {
    try {
        const querySnapshot = await getDocs(getUserCollection("empresas"))
        const companies = []
        querySnapshot.forEach((doc) => {
            companies.push({ id: doc.id, ...doc.data() })
        })
        console.log("Empresas carregadas:", companies)
        return companies
    } catch (error) {
        console.error("Erro ao carregar empresas:", error)
        throw error
    }
}

export async function loadEquipments() {
    try {
        const querySnapshot = await getDocs(getUserCollection("equipamentos"))
        const equipments = []
        querySnapshot.forEach((doc) => {
            equipments.push({ id: doc.id, ...doc.data() })
        })
        console.log("Equipamentos carregados:", equipments)
        return equipments
    } catch (error) {
        console.error("Erro ao carregar equipamentos:", error)
        throw error
    }
}

export async function loadServices() {
    try {
        const querySnapshot = await getDocs(getUserCollection("servicos"))
        const services = []
        querySnapshot.forEach((doc) => {
            services.push({ id: doc.id, ...doc.data() })
        })
        console.log("Serviços carregados:", services)
        return services
    } catch (error) {
        console.error("Erro ao carregar serviços:", error)
        throw error
    }
}

export async function saveClientToFirestore() {
    const clientData = {
        nameClient: document.querySelector('#clientModalContent #nameClient').value,
        cpfCNPJClient: document.querySelector('#clientModalContent #cpfCNPJClient').value,
        fantasyNameClient: document.querySelector('#clientModalContent #fantasyNameClient').value,
        streetClient: document.querySelector('#clientModalContent #streetClient').value,
        numberAddressClient: document.querySelector('#clientModalContent #numberAddressClient').value,
        neighborhoodClient: document.querySelector('#clientModalContent #neighborhoodClient').value,
        cityClient: document.querySelector('#clientModalContent #cityClient').value,
        zipcodeClient: document.querySelector('#clientModalContent #zipcodeClient').value,
        stateClient: document.querySelector('#clientModalContent #stateClient').value,
        phoneClient: document.querySelector('#clientModalContent #phoneClient').value,
        emailClient: document.querySelector('#clientModalContent #emailClient').value
    }
    await setDoc(doc(getUserCollection('clientes')), clientData);
}

export async function saveCompanyToFirestore() {
    const companyData = {
        nomeEmpresa: document.querySelector('#companyModalContent #nameBusiness').value,
        fantasyName: document.querySelector('#companyModalContent #fantasyName').value,
        cnpj: document.querySelector('#companyModalContent #cpfCnpj').value,
        endereco: document.querySelector('#companyModalContent #address').value,
        numero: document.querySelector('#companyModalContent #numberAddress').value,
        bairro: document.querySelector('#companyModalContent #neighborhood').value,
        estado: document.querySelector('#companyModalContent #state').value,
        cidade: document.querySelector('#companyModalContent #city').value,
        cep: document.querySelector('#companyModalContent #zipcode').value,
        telefone: document.querySelector('#companyModalContent #phone').value,
        email: document.querySelector('#companyModalContent #email').value
    }
    await setDoc(doc(getUserCollection('empresas')), companyData)
}

export async function saveEquipmentToFirestore() {
    const equipmentData = {
        codeEquipment: document.querySelector('#equipmentModalContent .codeEquipment').value,
        nameEquipment: document.querySelector('#equipmentModalContent .nameEquipment').value,
        unitPriceEquipment: document.querySelector('#equipmentModalContent .unitPriceEquipment').value
    }
    await setDoc(doc(getUserCollection('equipamentos')), equipmentData)
}

export async function saveServiceToFirestore() {
    const serviceData = {
        descriptionService: document.querySelector('#serviceModalContent .descriptionService').value,
        amountService: document.querySelector('#serviceModalContent .amountService').value
    }
    await setDoc(doc(getUserCollection('servicos')), serviceData)
}

export async function saveModalData(targetId) {
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

export async function loadClientForEdit(id) {
    try {
        const clientDoc = await getDoc(getUserDoc('clientes', id))
        if (clientDoc.exists()) {
            const data = clientDoc.data()

            document.getElementById('nameClient').value = data.nameClient || ""
            document.getElementById('cpfCNPJClient').value = data.cpfCNPJClient || ""
            document.getElementById('fantasyNameClient').value = data.fantasyNameClient || ""
            document.getElementById('streetClient').value = data.streetClient || ""
            document.getElementById('numberAddressClient').value = data.numberAddressClient || ""
            document.getElementById('neighborhoodClient').value = data.neighborhoodClient || ""
            document.getElementById('cityClient').value = data.cityClient || ""
            document.getElementById('zipcodeClient').value = data.zipcodeClient || ""
            document.getElementById('stateClient').value = data.stateClient || ""
            document.getElementById('phoneClient').value = data.phoneClient || ""
            document.getElementById('emailClient').value = data.emailClient || ""

            const saveButton = document.querySelector('.button-container button:first-child')
            saveButton.textContent = "Salvar Alterações"
            saveButton.onclick = () => updateClientToFirestore(id)
        } else {
            console.error(`Cliente com ID ${id} não encontrado.`)
            alert("Cliente não encontrado.")
        }
    } catch (error) {
        console.error("Erro ao carregar cliente para edição:", error)
        alert("Erro ao carregar cliente para edição.")
    }
}

export async function loadOrcamentoForEdit(id) {
    try {
        const orcamentoDoc = await getDoc(getUserDoc('orcamentos', id))
        if (orcamentoDoc.exists()) {
            const data = orcamentoDoc.data()

            document.getElementById('nameBusiness').value = data.empresa.nomeEmpresa || ""
            document.getElementById('fantasyName').value = data.empresa.fantasyName || ""
            document.getElementById('cpfCnpj').value = data.empresa.cnpj || ""
            document.getElementById('address').value = data.empresa.endereco || ""
            document.getElementById('numberAddress').value = data.empresa.numero || ""
            document.getElementById('neighborhood').value = data.empresa.bairro || ""
            document.getElementById('state').value = data.empresa.estado || ""
            document.getElementById('city').value = data.empresa.cidade || ""
            document.getElementById('zipcode').value = data.empresa.cep || ""
            document.getElementById('phone').value = data.empresa.telefone || ""
            document.getElementById('email').value = data.empresa.email || ""

            document.getElementById('nameClient').value = data.cliente.nameClient || ""
            document.getElementById('cpfCNPJClient').value = data.cliente.cpfCNPJClient || ""
            document.getElementById('fantasyNameClient').value = data.cliente.fantasyNameClient || ""
            document.getElementById('streetClient').value = data.cliente.streetClient || ""
            document.getElementById('numberAddressClient').value = data.cliente.numberAddressClient || ""
            document.getElementById('neighborhoodClient').value = data.cliente.neighborhoodClient || ""
            document.getElementById('cityClient').value = data.cliente.cityClient || ""
            document.getElementById('zipcodeClient').value = data.cliente.zipcodeClient || ""
            document.getElementById('stateClient').value = data.cliente.stateClient || ""
            document.getElementById('phoneClient').value = data.cliente.phoneClient || ""
            document.getElementById('emailClient').value = data.cliente.emailClient || ""

            const servicesContainer = document.getElementById('services-container')
            servicesContainer.innerHTML = ""
            data.servicos.forEach(servico => {
                const newServiceItem = document.createElement('div')
                newServiceItem.classList.add('service-item')
                newServiceItem.innerHTML = `
                    <label for="descriptionService">Descrição do Serviço:</label>
                    <input type="text" class="descriptionService" name="descriptionService" value="${servico.descriptionService}">
                    <label for="amountService">Valor do Serviço:</label>
                    <input type="text" class="amountService" name="amountService" value="${servico.amountService}">
                `
                servicesContainer.appendChild(newServiceItem)
                applyInputMasks(newServiceItem)
            })

            const includeEquipmentsCheckbox = document.getElementById('includeEquipments')
            const equipmentsContainer = document.getElementById('equipments-container')
            if (data.equipamentos.length > 0) {
                includeEquipmentsCheckbox.checked = true
                document.getElementById('materials-btn').style.display = 'block'
                equipmentsContainer.innerHTML = ""
                data.equipamentos.forEach(equipamento => {
                    const newEquipmentItem = document.createElement('div')
                    newEquipmentItem.classList.add('equipment-item')
                    newEquipmentItem.innerHTML = `
                        <div class="equipment-row">
                            <div class="field-group code-name">
                                <label>Código:</label>
                                <input type="text" class="codeEquipment" value="${equipamento.codeEquipment}">
                            </div>
                            <div class="field-group code-name">
                                <label>Nome:</label>
                                <input type="text" class="nameEquipment" value="${equipamento.nameEquipment}">
                            </div>
                        </div>
                        <div class="equipment-row">
                            <div class="field-group quantity-price-subtotal">
                                <label>Quantidade:</label>
                                <input type="number" class="quantityEquipment" value="${equipamento.quantityEquipment}" min="1">
                            </div>
                            <div class="field-group quantity-price-subtotal">
                                <label>Preço Unitário:</label>
                                <input type="text" class="unitPriceEquipment" value="${equipamento.unitPriceEquipment}">
                            </div>
                            <div class="field-group quantity-price-subtotal">
                                <label>Subtotal:</label>
                                <input type="text" class="subtotalEquipment" value="${equipamento.subtotalEquipment}" readonly>
                            </div>
                        </div>
                    `
                    equipmentsContainer.appendChild(newEquipmentItem)
                    applyInputMasks(newEquipmentItem)
                })
            }

            document.getElementById('observations').value = data.observacoes || ""

            const saveButton = document.querySelector('.button-container button:first-child')
            saveButton.textContent = "Salvar Alterações"
            saveButton.onclick = () => updateDataToFirestore(id)
        } else {
            console.error(`Orçamento com ID ${id} não encontrado.`)
            alert("Orçamento não encontrado.")
        }
    } catch (error) {
        console.error("Erro ao carregar orçamento para edição:", error)
        alert("Erro ao carregar orçamento para edição.")
    }
}

export async function updateClientToFirestore(id) {
    const clientData = {
        nameClient: document.getElementById('nameClient').value,
        cpfCNPJClient: document.getElementById('cpfCNPJClient').value,
        fantasyNameClient: document.getElementById('fantasyNameClient').value,
        streetClient: document.getElementById('streetClient').value,
        numberAddressClient: document.getElementById('numberAddressClient').value,
        neighborhoodClient: document.getElementById('neighborhoodClient').value,
        cityClient: document.getElementById('cityClient').value,
        zipcodeClient: document.getElementById('zipcodeClient').value,
        stateClient: document.getElementById('stateClient').value,
        phoneClient: document.getElementById('phoneClient').value,
        emailClient: document.getElementById('emailClient').value
    }

    try {
        await updateDoc(getUserDoc('clientes', id), clientData)
        alert("Cliente atualizado com sucesso!")
        window.location.href = "listclients.html"
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error)
        alert("Erro ao atualizar cliente.")
    }
}

export async function loadOrcamentos() {
    const tbody = document.querySelector("#orcamentosTable tbody")
    if (!tbody) {
        console.warn('Elemento #orcamentosTable tbody não encontrado.')
        return
    }

    try {
        const querySnapshot = await getDocs(getUserCollection('orcamentos'))
        tbody.innerHTML = ""
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = `
                <tr>
                    <td>${data.numericId || doc.id}</td>
                    <td>${data.empresa.nomeEmpresa}</td>
                    <td>${data.cliente.nameClient}</td>
                    <td>${data.dataCriacao.toDate().toLocaleDateString()}</td>
                    <td>
                        <button class="view-btn" onclick="App.viewOrcamento('${doc.id}')"><i class="fas fa-eye"></i></button>
                        <button class="edit-btn" onclick="App.editOrcamento('${doc.id}')"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="App.deleteOrcamento('${doc.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `
            tbody.innerHTML += row
        })
    } catch (error) {
        console.error("Erro ao carregar orçamentos:", error)
        alert("Erro ao carregar orçamentos.")
    }
}

export async function loadOrcamentoDetails() {
    const urlParams = new URLSearchParams(window.location.search)
    const orcamentoId = urlParams.get('id')
    const detalhesDiv = document.getElementById("detalhesOrcamento")

    try {
        const docSnap = await getDoc(getUserDoc('orcamentos', orcamentoId))
        if (docSnap.exists()) {
            const data = docSnap.data()
            detalhesDiv.innerHTML = `
                <p><strong>ID:</strong> ${data.numericId || docSnap.id}</p>
                <p><strong>Empresa:</strong> ${data.empresa.nomeEmpresa}</p>
                <p><strong>Cliente:</strong> ${data.cliente.nameClient}</p>
                <p><strong>Data de Criação:</strong> ${data.dataCriacao.toDate().toLocaleDateString()}</p>
                <h2>Serviços:</h2>
                <ul>
                    ${data.servicos.map(servico => `<li>${servico.descriptionService} - R$ ${servico.amountService}</li>`).join("")}
                </ul>
                <h2>Equipamentos:</h2>
                <ul>
                    ${data.equipamentos.map(equipamento => `<li>${equipamento.nameEquipment} - ${equipamento.quantityEquipment} x R$ ${equipamento.unitPriceEquipment}</li>`).join("")}
                </ul>
                <p><strong>Observações:</strong> ${data.observacoes}</p>
            `
        } else {
            detalhesDiv.innerHTML = "<p>Orçamento não encontrado.</p>"
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes do orçamento:", error)
        detalhesDiv.innerHTML = "<p>Erro ao carregar detalhes.</p>"
    }
}