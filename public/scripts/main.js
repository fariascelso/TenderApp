import { generatorPDF } from './GeneratorPDF.js';

const firebaseConfig = {
    apiKey: "AIzaSyCrqYU-lgB8XFiYVzUR5n7hyUW1hOqlZdg",
    authDomain: "masterclimatizadores-f03bf.firebaseapp.com",
    projectId: "masterclimatizadores-f03bf",
    storageBucket: "masterclimatizadores-f03bf.appspot.com",
    messagingSenderId: "387752534660",
    appId: "1:387752534660:web:e8a188e296d0900f1918d1",
    measurementId: "G-2PQQZQ1KRX"
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

function injectModalContent(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId)
    const targetElement = document.getElementById(targetId)

    console.log(`Tentando injetar conteúdo de ${sourceId} para ${targetId}`)
    if (sourceElement && targetElement) {
        console.log(`Elementos encontrados: ${sourceId} e ${targetId}`)
        const clonedContent = sourceElement.cloneNode(true)
        console.log('Conteúdo clonado:', clonedContent.innerHTML)

        clonedContent.classList.remove('panel')
        clonedContent.id = ''

        if (targetId === 'clientModalContent') {
            const clientSelectLabel = clonedContent.querySelector('label[for="clientSelect"]')
            const clientSelect = clonedContent.querySelector('#clientSelect')
            if (clientSelectLabel) clientSelectLabel.remove()
            if (clientSelect) clientSelect.remove()
        } else if (targetId === 'companyModalContent') {
            const companySelectLabel = clonedContent.querySelector('label[for="companySelect"]')
            const companySelect = clonedContent.querySelector('#companySelect')
            if (companySelectLabel) companySelectLabel.remove()
            if (companySelect) companySelect.remove()
        } else if (targetId === 'equipmentModalContent') {
            const addEquipmentBtn = clonedContent.querySelector('#add-equipment-btn')
            if (addEquipmentBtn) addEquipmentBtn.remove()
            const quantityLabel = clonedContent.querySelector('label[for="quantityEquipment"]')
            const quantityInput = clonedContent.querySelector('.quantityEquipment')
            if (quantityLabel) quantityLabel.remove()
            if (quantityInput) quantityInput.remove()
            const subtotalLabel = clonedContent.querySelector('label[for="subtotalEquipment"]')
            const subtotalInput = clonedContent.querySelector('.subtotalEquipment')
            if (subtotalLabel) subtotalLabel.remove()
            if (subtotalInput) subtotalInput.remove()
        } else if (targetId === 'serviceModalContent') {
            const addServiceBtn = clonedContent.querySelector('#add-service-btn')
            if (addServiceBtn) addServiceBtn.remove()
        }

        targetElement.innerHTML = ''
        targetElement.appendChild(clonedContent)

        applyInputMasks(targetElement)

        const saveButton = document.createElement('button')
        saveButton.textContent = 'Salvar'
        saveButton.className = 'modal-save-btn'
        saveButton.addEventListener('click', () => saveModalData(targetId))
        targetElement.appendChild(saveButton)
        console.log('Conteúdo após injeção:', targetElement.innerHTML)
    } else {
        console.error(`Elemento ${sourceId} ou ${targetId} não encontrado.`)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const mainFab = document.getElementById('main-fab');
    const fabOptions = document.getElementById('fab-options');

    if (mainFab && fabOptions) {
        // Evento de clique
        mainFab.addEventListener('click', function () {
            fabOptions.classList.toggle('show');
        });

        // Evento de toque para dispositivos móveis
        mainFab.addEventListener('touchstart', function (e) {
            e.preventDefault(); // Evita comportamento padrão
            fabOptions.classList.toggle('show');
        });
    } else {
        console.error('Elementos main-fab ou fab-options não encontrados no DOM.');
    }

    const fabOptionsButtons = document.querySelectorAll(".fab-option");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    modals.forEach(modal => {
        modal.style.display = "none";
    });

    fabOptionsButtons.forEach(button => {
        // Evento de clique
        button.addEventListener("click", () => {
            const targetModal = document.getElementById(button.dataset.target);
            if (targetModal) {
                let sourceId, targetId;
                if (button.dataset.target === "clientModal") {
                    sourceId = "client-data-panel";
                    targetId = "clientModalContent";
                } else if (button.dataset.target === "companyModal") {
                    sourceId = "company-data-panel";
                    targetId = "companyModalContent";
                } else if (button.dataset.target === "equipmentModal") {
                    sourceId = "equipments-panel";
                    targetId = "equipmentModalContent";
                } else if (button.dataset.target === "serviceModal") {
                    sourceId = "services-container";
                    targetId = "serviceModalContent";
                }

                injectModalContent(sourceId, targetId);

                setTimeout(() => {
                    targetModal.classList.add("show");
                    targetModal.style.display = "flex";
                }, 0);
            }
        });
    });

    // Adicione eventos de toque para os botões de fechar
    closeButtons.forEach(button => {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });

        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });
    });

    // Adicione eventos de toque para fechar o modal ao clicar fora
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("show");
                setTimeout(() => {
                    modal.style.display = "none";
                }, 300);
            }
        });
    });

    const menuHamburger = document.getElementById('menu-hamburger');
    if (menuHamburger) {
        menuHamburger.addEventListener('click', function() {
            const menuLinks = document.getElementById('menu-links');
            menuLinks.classList.toggle('show');
        });

        // Evento de toque para o menu hambúrguer
        menuHamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const menuLinks = document.getElementById('menu-links');
            menuLinks.classList.toggle('show');
        });
    } else {
        console.error('Elemento menu-hamburger não encontrado no DOM.');
    }

    applyInputMasks(document);
});

async function generateNumericId() {
    const counterRef = db.collection('counters').doc('orcamentoCounter')
    let numericId

    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef)
        if (!doc.exists) {
            transaction.set(counterRef, { count: 1 })
            numericId = 1
        } else {
            const currentCount = doc.data().count
            numericId = currentCount + 1
            transaction.update(counterRef, { count: numericId })
        }
    })

    return numericId
}

export async function saveDataToFirestore() {
    toggleButtonLoading('save-budget-btn', true); // Mostra o spinner

    try {
        const numericId = await generateNumericId();

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

    const equipmentData = []
    const codes = document.querySelectorAll('.codeEquipment')
    const names = document.querySelectorAll('.nameEquipment')
    const quantities = document.querySelectorAll('.quantityEquipment')
    const unitPrices = document.querySelectorAll('.unitPriceEquipment')
    const subtotals = document.querySelectorAll('.subtotalEquipment')

    const observations = document.getElementById('observations').value

    for (let i = 0; i < codes.length; i++) {
        equipmentData.push({
            codeEquipment: codes[i].value,
            nameEquipment: names[i].value,
            quantityEquipment: quantities[i].value,
            unitPriceEquipment: unitPrices[i].value,
            subtotalEquipment: subtotals[i].value
        })
    }

    for (let i = 0; i < descriptions.length; i++) {
        serviceData.push({
            descriptionService: descriptions[i].value,
            amountService: amounts[i].value
        })
    }

    const orcamento = {
        empresa: issuingCompany,
        cliente: clientFormData,
        servicos: serviceData,
        equipamentos: equipmentData,
        observacoes: observations,
        dataCriacao: new Date()
    }

        await db.collection("orcamentos").doc(numericId.toString()).set(orcamento)

        alert(`Orçamento salvo com sucesso! ID do orçamento: ${numericId}`)
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e)
        alert("Erro ao salvar orçamento.")
    } finally {
        toggleButtonLoading('save-budget-btn', false); // Esconde o spinner
    }
}

window.saveDataToFirestore = saveDataToFirestore

const addServiceBtn = document.getElementById('add-service-btn')
if (addServiceBtn) {
    addServiceBtn.addEventListener('click', function () {
        const servicesContainer = document.getElementById('services-container')

        const newServiceItem = document.createElement('div')
        newServiceItem.classList.add('service-item')

        newServiceItem.innerHTML = `
            <label for="descriptionService">Descrição do Serviço:</label>
            <input type="text" class="descriptionService" name="descriptionService" placeholder="Descrição do serviço">
            <label for="amountService">Valor do Serviço:</label>
            <input type="text" class="amountService" name="amountService" placeholder="Valor do serviço">
        `

        servicesContainer.appendChild(newServiceItem)
    })
}

function parseCurrency(value) {
    if (!value) return 0;
    // Remove "R$" e substitui "." (milhar) por "" e "," (decimal) por "."
    const cleanValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(cleanValue) || 0;
}

const equipmentsContainer = document.getElementById('equipments-container');
if (equipmentsContainer) {
    equipmentsContainer.addEventListener('input', function (event) {
        const equipmentItem = event.target.closest('.equipment-item');
        if (!equipmentItem) return; // Garante que o evento está dentro de um .equipment-item

        const quantity = equipmentItem.querySelector('.quantityEquipment').value;
        const unitPrice = equipmentItem.querySelector('.unitPriceEquipment').value;
        const subtotal = equipmentItem.querySelector('.subtotalEquipment');

        const qty = parseFloat(quantity) || 0;
        const price = parseCurrency(unitPrice);
        const calculatedSubtotal = qty * price;

        subtotal.value = calculatedSubtotal ? `R$ ${calculatedSubtotal.toFixed(2).replace('.', ',')}` : '';
    });
}

const addEquipmentBtn = document.getElementById('add-equipment-btn')
if (addEquipmentBtn) {
    addEquipmentBtn.addEventListener('click', function () {
        const equipmentsContainer = document.getElementById('equipments-container')

        const newEquipmentItem = document.createElement('div')
        newEquipmentItem.classList.add('equipment-item')

        newEquipmentItem.innerHTML = `
            <label for="codeEquipment">Código:</label>
            <input type="text" class="codeEquipment" placeholder="Código do equipamento">
            
            <label for="nameEquipment">Nome:</label>
            <input type="text" class="nameEquipment" placeholder="Nome do equipamento">
            
            <label for="quantityEquipment">Quantidade:</label>
            <input type="number" class="quantityEquipment" placeholder="Quantidade" min="1">
            
            <label for="unitPriceEquipment">Preço Unitário:</label>
            <input type="text" class="unitPriceEquipment" placeholder="Preço unitário">
            
            <label for="subtotalEquipment">Subtotal:</label>
            <input type="text" class="subtotalEquipment" placeholder="Subtotal" readonly>
        `

        equipmentsContainer.appendChild(newEquipmentItem)
        applyInputMasks(newEquipmentItem);
    })
}

const includeEquipmentsCheckbox = document.getElementById('includeEquipments')
const materialsBtn = document.getElementById('materials-btn')

if (includeEquipmentsCheckbox && materialsBtn) {
    includeEquipmentsCheckbox.addEventListener('change', function () {
        if (includeEquipmentsCheckbox.checked) {
            materialsBtn.style.display = 'block'
        } else {
            materialsBtn.style.display = 'none'
        }
    })
}

export async function loadClients() {
    const clientSelect = document.getElementById('clientSelect')

    try {
        const querySnapshot = await db.collection("clientes").get()

        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>'

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const option = document.createElement('option')
            option.value = JSON.stringify(data)
            option.textContent = data.nameClient
            clientSelect.appendChild(option)
        })

    } catch (error) {
        console.error("Erro ao carregar clientes:", error)
        clientSelect.innerHTML = '<option value="">Erro ao carregar</option>'
    }
}

export function fillCompanyData() {
    const companySelect = document.getElementById('companySelect')
    const selectedData = companySelect.value

    if (!selectedData) return

    const data = JSON.parse(selectedData)

    document.getElementById('nameBusiness').value = data.nomeEmpresa || ""
    document.getElementById('fantasyName').value = data.fantasyName || ""
    document.getElementById('cpfCnpj').value = data.cnpj || ""
    document.getElementById('address').value = data.endereco || ""
    document.getElementById('numberAddress').value = data.numero || ""
    document.getElementById('neighborhood').value = data.bairro || ""
    document.getElementById('state').value = data.estado || ""
    document.getElementById('city').value = data.cidade || ""
    document.getElementById('zipcode').value = data.cep || ""
    document.getElementById('phone').value = data.telefone || ""
    document.getElementById('email').value = data.email || ""
}

window.fillCompanyData = fillCompanyData

export async function loadCompanies() {
    const companySelect = document.getElementById('companySelect')

    try {
        const querySnapshot = await db.collection("empresasEmitenteOrcamento").get()

        companySelect.innerHTML = '<option value="">Selecione uma empresa</option>'

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const option = document.createElement('option')
            option.value = JSON.stringify(data)
            option.textContent = data.nomeEmpresa
            companySelect.appendChild(option)
        })

    } catch (error) {
        console.error("Erro ao carregar empresas:", error)
        companySelect.innerHTML = '<option value="">Erro ao carregar</option>'
    }
}

export function fillClientData() {
    const clientSelect = document.getElementById('clientSelect')
    const selectedData = clientSelect.value

    if (!selectedData) return

    const data = JSON.parse(selectedData)

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
}

window.fillClientData = fillClientData

async function generatePDFWithLogo() {
    toggleButtonLoading('generate-pdf-btn', true); // Mostra o spinner antes de iniciar
    
    try {
        const numericId = await generateNumericId();
        await generatorPDF(uploadedLogo, numericId); // Passa a variável uploadedLogo
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Erro ao gerar PDF. Veja o console para mais detalhes.");
    } finally {
        toggleButtonLoading('generate-pdf-btn', false); // Esconde o spinner
    }
}

window.generatePDFWithLogo = generatePDFWithLogo;

let uploadedLogo = null; // Variável global para armazenar a imagem enviada

function handleLogoUpload(event) {
    const file = event.target.files[0];
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewText = document.getElementById('logoPreviewText');

    if (file) {
        // Validação básica
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem válido.');
            event.target.value = ''; // Limpa o campo
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
            alert('A imagem não pode exceder 5MB.');
            event.target.value = ''; // Limpa o campo
            return;
        }

        // Converter a imagem para base64
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedLogo = e.target.result; // Armazena a imagem em base64
            logoPreview.src = uploadedLogo; // Mostra a pré-visualização
            logoPreview.style.display = 'block';
            logoPreviewText.textContent = 'Imagem selecionada: ' + file.name;
        };
        reader.onerror = function() {
            alert('Erro ao carregar a imagem.');
            event.target.value = ''; // Limpa o campo
        };
        reader.readAsDataURL(file);
    } else {
        uploadedLogo = null;
        logoPreview.style.display = 'none';
        logoPreviewText.textContent = 'Nenhuma imagem selecionada.';
    }
}

window.handleLogoUpload = handleLogoUpload; // Expõe a função para o HTML

window.onload = function () {
    loadClients()
    loadCompanies()

    const urlParams = new URLSearchParams(window.location.search);
    const orcamentoId = urlParams.get('id');

    if (orcamentoId) {
        loadOrcamentoForEdit(orcamentoId);
    }
}

async function loadOrcamentoForEdit(id) {
    try {
        const doc = await db.collection("orcamentos").doc(id).get();
        if (doc.exists) {
            const data = doc.data();

            // Preencher dados da empresa
            document.getElementById('nameBusiness').value = data.empresa.nomeEmpresa || "";
            document.getElementById('fantasyName').value = data.empresa.fantasyName || "";
            document.getElementById('cpfCnpj').value = data.empresa.cnpj || "";
            document.getElementById('address').value = data.empresa.endereco || "";
            document.getElementById('numberAddress').value = data.empresa.numero || "";
            document.getElementById('neighborhood').value = data.empresa.bairro || "";
            document.getElementById('state').value = data.empresa.estado || "";
            document.getElementById('city').value = data.empresa.cidade || "";
            document.getElementById('zipcode').value = data.empresa.cep || "";
            document.getElementById('phone').value = data.empresa.telefone || "";
            document.getElementById('email').value = data.empresa.email || "";

            // Preencher dados do cliente
            document.getElementById('nameClient').value = data.cliente.nameClient || "";
            document.getElementById('cpfCNPJClient').value = data.cliente.cpfCNPJClient || "";
            document.getElementById('fantasyNameClient').value = data.cliente.fantasyNameClient || "";
            document.getElementById('streetClient').value = data.cliente.streetClient || "";
            document.getElementById('numberAddressClient').value = data.cliente.numberAddressClient || "";
            document.getElementById('neighborhoodClient').value = data.cliente.neighborhoodClient || "";
            document.getElementById('cityClient').value = data.cliente.cityClient || "";
            document.getElementById('zipcodeClient').value = data.cliente.zipcodeClient || "";
            document.getElementById('stateClient').value = data.cliente.stateClient || "";
            document.getElementById('phoneClient').value = data.cliente.phoneClient || "";
            document.getElementById('emailClient').value = data.cliente.emailClient || "";

            // Preencher serviços
            const servicesContainer = document.getElementById('services-container');
            servicesContainer.innerHTML = ""; // Limpar serviços existentes
            data.servicos.forEach(servico => {
                const newServiceItem = document.createElement('div');
                newServiceItem.classList.add('service-item');
                newServiceItem.innerHTML = `
                    <label for="descriptionService">Descrição do Serviço:</label>
                    <input type="text" class="descriptionService" name="descriptionService" value="${servico.descriptionService}">
                    <label for="amountService">Valor do Serviço:</label>
                    <input type="text" class="amountService" name="amountService" value="${servico.amountService}">
                `;
                servicesContainer.appendChild(newServiceItem);
            });

            // Preencher equipamentos (se existirem)
            const includeEquipmentsCheckbox = document.getElementById('includeEquipments');
            const equipmentsContainer = document.getElementById('equipments-container');
            if (data.equipamentos.length > 0) {
                includeEquipmentsCheckbox.checked = true;
                document.getElementById('materials-btn').style.display = 'block';
                equipmentsContainer.innerHTML = ""; // Limpar equipamentos existentes
                data.equipamentos.forEach(equipamento => {
                    const newEquipmentItem = document.createElement('div');
                    newEquipmentItem.classList.add('equipment-item');
                    newEquipmentItem.innerHTML = `
                        <label for="codeEquipment">Código:</label>
                        <input type="text" class="codeEquipment" value="${equipamento.codeEquipment}">
                        <label for="nameEquipment">Nome:</label>
                        <input type="text" class="nameEquipment" value="${equipamento.nameEquipment}">
                        <label for="quantityEquipment">Quantidade:</label>
                        <input type="number" class="quantityEquipment" value="${equipamento.quantityEquipment}" min="1">
                        <label for="unitPriceEquipment">Preço Unitário:</label>
                        <input type="text" class="unitPriceEquipment" value="${equipamento.unitPriceEquipment}">
                        <label for="subtotalEquipment">Subtotal:</label>
                        <input type="text" class="subtotalEquipment" value="${equipamento.subtotalEquipment}" readonly>
                    `;
                    equipmentsContainer.appendChild(newEquipmentItem);
                });
            }

            // Preencher observações
            document.getElementById('observations').value = data.observacoes || "";

            // Alterar o texto do botão "Salvar" para indicar edição
            const saveButton = document.querySelector('.button-container button:first-child');
            saveButton.textContent = "Salvar Alterações";
            saveButton.onclick = () => updateDataToFirestore(id);
        }
    } catch (error) {
        console.error("Erro ao carregar orçamento para edição:", error);
        alert("Erro ao carregar orçamento para edição.");
    }
}

async function updateDataToFirestore(id) {
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
    };

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
    };

    const serviceData = [];
    const descriptions = document.querySelectorAll('.descriptionService');
    const amounts = document.querySelectorAll('.amountService');
    for (let i = 0; i < descriptions.length; i++) {
        serviceData.push({
            descriptionService: descriptions[i].value,
            amountService: amounts[i].value
        });
    }

    const equipmentData = [];
    const codes = document.querySelectorAll('.codeEquipment');
    const names = document.querySelectorAll('.nameEquipment');
    const quantities = document.querySelectorAll('.quantityEquipment');
    const unitPrices = document.querySelectorAll('.unitPriceEquipment');
    const subtotals = document.querySelectorAll('.subtotalEquipment');
    for (let i = 0; i < codes.length; i++) {
        equipmentData.push({
            codeEquipment: codes[i].value,
            nameEquipment: names[i].value,
            quantityEquipment: quantities[i].value,
            unitPriceEquipment: unitPrices[i].value,
            subtotalEquipment: subtotals[i].value
        });
    }

    const observations = document.getElementById('observations').value;

    const orcamento = {
        empresa: issuingCompany,
        cliente: clientFormData,
        servicos: serviceData,
        equipamentos: equipmentData,
        observacoes: observations,
        dataCriacao: new Date() // Ou mantenha a data original, se desejar
    };

    try {
        await db.collection("orcamentos").doc(id).update(orcamento);
        alert(`Orçamento atualizado com sucesso! ID: ${id}`);
        window.location.href = "pages/listorders.html"; // Redireciona para a lista após salvar
    } catch (e) {
        console.error("Erro ao atualizar documento: ", e);
        alert("Erro ao atualizar orçamento.");
    }
}

window.updateDataToFirestore = updateDataToFirestore;

function editOrcamento(id) {
    window.location.href = `../index.html?id=${id}`;
}

window.editOrcamento = editOrcamento;

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        const editableText = document.getElementById('nome-empresa')
        if (editableText) {
            editableText.addEventListener('blur', function () {
                console.log('Nome atualizado:', editableText.value)
            })

            editableText.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    editableText.blur()
                }
            })

            observer.disconnect()
        }
    })
})

observer.observe(document.body, { childList: true, subtree: true })

function navigateToListarOrcamentos() {
    window.location.href = "pages/listorders.html";
}

function navigateToCriarOrcamento() {
    window.location.href = "index.html"
}

window.navigateToListarOrcamentos = navigateToListarOrcamentos
window.navigateToCriarOrcamento = navigateToCriarOrcamento

async function loadOrcamentos() {
    const tbody = document.querySelector("#orcamentosTable tbody")

    try {
        const querySnapshot = await db.collection("orcamentos").get()

        tbody.innerHTML = ""
      
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${data.empresa.nomeEmpresa}</td>
                <td>${data.cliente.nameClient}</td>
                <td>${data.dataCriacao.toDate().toLocaleDateString()}</td>
                <td>
                    <button class="view-btn" onclick="viewOrcamento('${doc.id}')">
                    <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editOrcamento('${doc.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteOrcamento('${doc.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
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

function viewOrcamento(id) {
    window.location.href = `details.html?id=${id}`
}

window.viewOrcamento = viewOrcamento

async function deleteOrcamento(id) {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
        try {
            await db.collection("orcamentos").doc(id).delete()
            alert("Orçamento excluído com sucesso!")
            loadOrcamentos()
        } catch (error) {
            console.error("Erro ao excluir orçamento:", error)
            alert("Erro ao excluir orçamento.")
        }
    }
}

window.deleteOrcamento = deleteOrcamento

if (window.location.pathname.includes("listorders.html")) {
    window.onload = loadOrcamentos
}

async function loadOrcamentoDetails() {
    const urlParams = new URLSearchParams(window.location.search)
    const orcamentoId = urlParams.get('id')
    const detalhesDiv = document.getElementById("detalhesOrcamento")

    try {
        const doc = await db.collection("orcamentos").doc(orcamentoId).get()
        if (doc.exists) {
            const data = doc.data()
            detalhesDiv.innerHTML = `
                <p><strong>ID:</strong> ${doc.id}</p>
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

if (window.location.pathname.includes("/details.html")) {
    window.onload = loadOrcamentoDetails
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

async function saveClientToFirestore() {
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
    await db.collection('clientes').add(clientData)
}

async function saveCompanyToFirestore() {
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
    await db.collection('empresasEmitenteOrcamento').add(companyData)
}

async function saveEquipmentToFirestore() {
    const equipmentData = {
        codeEquipment: document.querySelector('#equipmentModalContent .codeEquipment').value,
        nameEquipment: document.querySelector('#equipmentModalContent .nameEquipment').value,
        unitPriceEquipment: document.querySelector('#equipmentModalContent .unitPriceEquipment').value
    }
    await db.collection('equipamentos').add(equipmentData)
}

async function saveServiceToFirestore() {
    const serviceData = {
        descriptionService: document.querySelector('#serviceModalContent .descriptionService').value,
        amountService: document.querySelector('#serviceModalContent .amountService').value
    }
    await db.collection('servicos').add(serviceData)
}

function applyInputMasks(container) {
    if (typeof IMask === 'undefined') {
        console.error('IMask não está carregado. Verifique se o script foi incluído corretamente.');
        return;
    }

    const phoneInputs = container.querySelectorAll('#phone, #phoneClient')
    phoneInputs.forEach(input => {
        IMask(input, {
            mask: '(00) 00000-0000'
        })
    })

    const moneyInputs = container.querySelectorAll('.amountService, .unitPriceEquipment')
    moneyInputs.forEach(input => {
        IMask(input, {
            mask: 'R$ num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: '.', 
                    radix: ',',
                    mapToRadix: ['.'],
                    scale: 2,
                    signed: false,
                    padFractionalZeros: true,
                    normalizeZeros: true
                }
            }
        })
    })

    const cnpjInputs = container.querySelectorAll('#cpfCnpj, #cpfCNPJClient')
    cnpjInputs.forEach(input => {
        IMask(input, {
            mask: '00.000.000/0000-00'
        })
    })

    const cepInputs = container.querySelectorAll('#zipcode, #zipcodeClient')
    cepInputs.forEach(input => {
        IMask(input, {
            mask: '00000-000'
        })
    })
}

// Função auxiliar para controlar o estado do botão
function toggleButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const spinner = button.querySelector('.spinner');

    if (isLoading) {
        button.disabled = true; // Desabilita o botão
        spinner.style.display = 'inline-block'; // Mostra o spinner
    } else {
        button.disabled = false; // Reabilita o botão
        spinner.style.display = 'none'; // Esconde o spinner
    }
}