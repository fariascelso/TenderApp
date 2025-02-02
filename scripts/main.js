// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCrqYU-lgB8XFiYVzUR5n7hyUW1hOqlZdg",
    authDomain: "masterclimatizadores-f03bf.firebaseapp.com",
    projectId: "masterclimatizadores-f03bf",
    storageBucket: "masterclimatizadores-f03bf.appspot.com",
    messagingSenderId: "387752534660",
    appId: "1:387752534660:web:e8a188e296d0900f1918d1",
    measurementId: "G-2PQQZQ1KRX"
};

// Inicializar Firebase e Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function injectModalContent(sourceId, targetId) {
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);

    console.log(`Tentando injetar conteúdo de ${sourceId} para ${targetId}`);
    if (sourceElement && targetElement) {
        console.log(`Elementos encontrados: ${sourceId} e ${targetId}`);
        const clonedContent = sourceElement.cloneNode(true);
        console.log('Conteúdo clonado:', clonedContent.innerHTML);
        clonedContent.classList.remove('panel');
        clonedContent.id = '';
        targetElement.innerHTML = '';
        targetElement.appendChild(clonedContent);
        console.log('Conteúdo após injeção:', targetElement.innerHTML);
    } else {
        console.error(`Elemento ${sourceId} ou ${targetId} não encontrado.`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const mainFab = document.getElementById('main-fab');
    const fabOptions = document.getElementById('fab-options');

    if (mainFab && fabOptions) {
        mainFab.addEventListener('click', function () {
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

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });
    });

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

    // Adicionar evento ao menu hambúrguer
    const menuHamburger = document.getElementById('menu-hamburger');
    if (menuHamburger) {
        menuHamburger.addEventListener('click', function() {
            const menuLinks = document.getElementById('menu-links');
            menuLinks.classList.toggle('show');
        });
    } else {
        console.error('Elemento menu-hamburger não encontrado no DOM.');
    }
});

// Função para gerar um ID numérico único
async function generateNumericId() {
    const counterRef = db.collection('counters').doc('orcamentoCounter');
    let numericId;

    // Usar uma transação para garantir atomicidade
    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);
        if (!doc.exists) {
            // Se o contador não existir, crie com o valor inicial 1
            transaction.set(counterRef, { count: 1 });
            numericId = 1;
        } else {
            // Incrementar o contador
            const currentCount = doc.data().count;
            numericId = currentCount + 1;
            transaction.update(counterRef, { count: numericId });
        }
    });

    return numericId;
}

// Função para salvar o orçamento com um ID numérico
export async function saveDataToFirestore() {
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

    const equipmentData = [];
    const codes = document.querySelectorAll('.codeEquipment');
    const names = document.querySelectorAll('.nameEquipment');
    const quantities = document.querySelectorAll('.quantityEquipment');
    const unitPrices = document.querySelectorAll('.unitPriceEquipment');
    const subtotals = document.querySelectorAll('.subtotalEquipment');

    const observations = document.getElementById('observations').value;

    for (let i = 0; i < codes.length; i++) {
        equipmentData.push({
            codeEquipment: codes[i].value,
            nameEquipment: names[i].value,
            quantityEquipment: quantities[i].value,
            unitPriceEquipment: unitPrices[i].value,
            subtotalEquipment: subtotals[i].value
        });
    }

    for (let i = 0; i < descriptions.length; i++) {
        serviceData.push({
            descriptionService: descriptions[i].value,
            amountService: amounts[i].value
        });
    }

    const orcamento = {
        empresa: issuingCompany,
        cliente: clientFormData,
        servicos: serviceData,
        equipamentos: equipmentData,
        observacoes: observations,
        dataCriacao: new Date()
    };

    try {
        // Gerar um ID numérico único
        const numericId = await generateNumericId();

        // Salvar o orçamento com o ID numérico
        await db.collection("orcamentos").doc(numericId.toString()).set(orcamento);

        alert(`Orçamento salvo com sucesso! ID do orçamento: ${numericId}`);
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Erro ao salvar orçamento.");
    }
}

window.saveDataToFirestore = saveDataToFirestore;

// Função para adicionar novo serviço
// Verifica se o elemento existe antes de adicionar o evento
const addServiceBtn = document.getElementById('add-service-btn');
if (addServiceBtn) {
    addServiceBtn.addEventListener('click', function () {
        const servicesContainer = document.getElementById('services-container');

        const newServiceItem = document.createElement('div');
        newServiceItem.classList.add('service-item');

        newServiceItem.innerHTML = `
            <label for="descriptionService">Descrição do Serviço:</label>
            <input type="text" class="descriptionService" name="descriptionService" placeholder="Descrição do serviço">
            <label for="amountService">Valor do Serviço:</label>
            <input type="text" class="amountService" name="amountService" placeholder="Valor do serviço">
        `;

        servicesContainer.appendChild(newServiceItem);
    });
}

// Verifica se o elemento existe antes de adicionar o evento
const equipmentsContainer = document.getElementById('equipments-container');
if (equipmentsContainer) {
    equipmentsContainer.addEventListener('input', function (event) {
        const equipmentItem = event.target.closest('.equipment-item');
        const quantity = equipmentItem.querySelector('.quantityEquipment').value;
        const unitPrice = equipmentItem.querySelector('.unitPriceEquipment').value;
        const subtotal = equipmentItem.querySelector('.subtotalEquipment');

        // Cálculo do subtotal
        const calculatedSubtotal = parseFloat(quantity) * parseFloat(unitPrice || 0);
        subtotal.value = calculatedSubtotal ? `R$ ${calculatedSubtotal.toFixed(2)}` : '';
    });
}

// Verifica se o elemento existe antes de adicionar o evento
const addEquipmentBtn = document.getElementById('add-equipment-btn');
if (addEquipmentBtn) {
    addEquipmentBtn.addEventListener('click', function () {
        const equipmentsContainer = document.getElementById('equipments-container');

        const newEquipmentItem = document.createElement('div');
        newEquipmentItem.classList.add('equipment-item');

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
        `;

        equipmentsContainer.appendChild(newEquipmentItem);
    });
}

// Obtendo referência à checkbox e ao botão
const includeEquipmentsCheckbox = document.getElementById('includeEquipments');
const materialsBtn = document.getElementById('materials-btn');

// Evento para exibir ou ocultar o botão com base no estado da checkbox
if (includeEquipmentsCheckbox && materialsBtn) {
    includeEquipmentsCheckbox.addEventListener('change', function () {
        if (includeEquipmentsCheckbox.checked) {
            materialsBtn.style.display = 'block'; // Exibe o botão
        } else {
            materialsBtn.style.display = 'none'; // Oculta o botão
        }
    });
}

// Função para carregar os clientes ao abrir a página
export async function loadClients() {
    const clientSelect = document.getElementById('clientSelect');

    try {
        // Buscar todos os clientes no Firestore
        const querySnapshot = await db.collection("clientes").get();

        // Limpar opções existentes
        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';

        // Adicionar cada cliente como uma opção no select
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = JSON.stringify(data); // Armazena os dados do cliente na opção
            option.textContent = data.nameClient; // Exibir apenas o nome da empresa
            clientSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        clientSelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// Função para preencher os campos quando uma empresa for selecionada
export function fillCompanyData() {
    const companySelect = document.getElementById('companySelect');
    const selectedData = companySelect.value;

    if (!selectedData) return;

    const data = JSON.parse(selectedData); // Converter string para objeto

    // Preencher os campos do formulário com os dados da empresa
    document.getElementById('nameBusiness').value = data.nomeEmpresa || "";
    document.getElementById('fantasyName').value = data.fantasyName || "";
    document.getElementById('cpfCnpj').value = data.cnpj || "";
    document.getElementById('address').value = data.endereco || "";
    document.getElementById('numberAddress').value = data.numero || "";
    document.getElementById('neighborhood').value = data.bairro || "";
    document.getElementById('state').value = data.estado || "";
    document.getElementById('city').value = data.cidade || "";
    document.getElementById('zipcode').value = data.cep || "";
    document.getElementById('phone').value = data.telefone || "";
    document.getElementById('email').value = data.email || "";
}

window.fillCompanyData = fillCompanyData;

// Função para carregar as empresas ao abrir a página
export async function loadCompanies() {
    const companySelect = document.getElementById('companySelect');

    try {
        // Buscar todas as empresas no Firestore
        const querySnapshot = await db.collection("empresasEmitenteOrcamento").get();

        // Limpar opções existentes
        companySelect.innerHTML = '<option value="">Selecione uma empresa</option>';

        // Adicionar cada empresa como uma opção no select
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = JSON.stringify(data); // Armazena os dados da empresa na opção
            option.textContent = data.nomeEmpresa; // Exibir apenas o nome da empresa
            companySelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        companySelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// Função para preencher os campos quando um cliente for selecionado
export function fillClientData() {
    const clientSelect = document.getElementById('clientSelect');
    const selectedData = clientSelect.value;

    if (!selectedData) return;

    const data = JSON.parse(selectedData); // Converter string para objeto

    // Preencher os campos do formulário com os dados do cliente
    document.getElementById('nameClient').value = data.nameClient || "";
    document.getElementById('cpfCNPJClient').value = data.cpfCNPJClient || "";
    document.getElementById('fantasyNameClient').value = data.fantasyNameClient || "";
    document.getElementById('streetClient').value = data.streetClient || "";
    document.getElementById('numberAddressClient').value = data.numberAddressClient || "";
    document.getElementById('neighborhoodClient').value = data.neighborhoodClient || "";
    document.getElementById('cityClient').value = data.cityClient || "";
    document.getElementById('zipcodeClient').value = data.zipcodeClient || "";
    document.getElementById('stateClient').value = data.stateClient || "";
    document.getElementById('phoneClient').value = data.phoneClient || "";
    document.getElementById('emailClient').value = data.emailClient || "";
}

window.fillClientData = fillClientData;

// Chamar a função ao carregar a página
window.onload = function () {
    loadClients();
    loadCompanies();
};

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        const editableText = document.getElementById('nome-empresa');
        if (editableText) {
            // Quando o campo perde o foco, salva o valor (se necessário)
            editableText.addEventListener('blur', function () {
                console.log('Nome atualizado:', editableText.value);
            });

            // Opcional: Permitir que o Enter salve e saia do modo de edição
            editableText.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    editableText.blur(); // Remove o foco do campo
                }
            });

            observer.disconnect(); // Para de observar após encontrar o elemento
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Função para navegar para a página de listagem de orçamentos
function navigateToListarOrcamentos() {
    window.location.href = "listorders.html";
}

// Função para navegar para a página de criação de orçamento
function navigateToCriarOrcamento() {
    window.location.href = "index.html"; // Substitua pelo nome da sua página de criação
}

// Adicionar as funções ao escopo global (window) para que possam ser chamadas no HTML
window.navigateToListarOrcamentos = navigateToListarOrcamentos;
window.navigateToCriarOrcamento = navigateToCriarOrcamento;

// Função para carregar e exibir os orçamentos na página listorders.html
async function loadOrcamentos() {
    const tbody = document.querySelector("#orcamentosTable tbody");

    try {
        // Buscar todos os documentos da coleção "orcamentos"
        const querySnapshot = await db.collection("orcamentos").get();

        // Limpar o conteúdo atual da tabela
        tbody.innerHTML = "";

        // Iterar sobre cada documento
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${doc.id}</td>
                    <td>${data.empresa.nomeEmpresa}</td>
                    <td>${data.cliente.nameClient}</td>
                    <td>${data.dataCriacao.toDate().toLocaleDateString()}</td>
                    <td>
                        <button onclick="viewOrcamento('${doc.id}')">Ver Detalhes</button>
                        <button onclick="deleteOrcamento('${doc.id}')">Excluir</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Erro ao carregar orçamentos:", error);
        alert("Erro ao carregar orçamentos.");
    }
}

// Função para visualizar detalhes de um orçamento
function viewOrcamento(id) {
    window.location.href = `details.html?id=${id}`;
}

window.viewOrcamento = viewOrcamento

// Função para excluir um orçamento
async function deleteOrcamento(id) {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
        try {
            await db.collection("orcamentos").doc(id).delete();
            alert("Orçamento excluído com sucesso!");
            loadOrcamentos(); // Recarregar a lista após exclusão
        } catch (error) {
            console.error("Erro ao excluir orçamento:", error);
            alert("Erro ao excluir orçamento.");
        }
    }
}

window.deleteOrcamento = deleteOrcamento

// Carregar os orçamentos ao abrir a página listorders.html
if (window.location.pathname.includes("listorders.html")) {
    window.onload = loadOrcamentos;
}

// Função para carregar os detalhes do orçamento na página details.html
async function loadOrcamentoDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const orcamentoId = urlParams.get('id');
    const detalhesDiv = document.getElementById("detalhesOrcamento");

    try {
        const doc = await db.collection("orcamentos").doc(orcamentoId).get();
        if (doc.exists) {
            const data = doc.data();
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
            `;
        } else {
            detalhesDiv.innerHTML = "<p>Orçamento não encontrado.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes do orçamento:", error);
        detalhesDiv.innerHTML = "<p>Erro ao carregar detalhes.</p>";
    }
}

// Carregar os detalhes ao abrir a página details.html
if (window.location.pathname.includes("details.html")) {
    window.onload = loadOrcamentoDetails;
}