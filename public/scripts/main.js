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

document.addEventListener('DOMContentLoaded', function () {
    const mainFab = document.getElementById('main-fab');
    const fabOptions = document.getElementById('fab-options');

    if (mainFab && fabOptions) {
        mainFab.addEventListener('click', function () {
            fabOptions.classList.toggle('show');
        });
    }

    const fabOptionsButtons = document.querySelectorAll(".fab-option");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    // Garante que todas as modais estejam escondidas
    modals.forEach(modal => {
        modal.style.display = "none";
    });

    // Adiciona evento de clique para abrir a modal correspondente
    fabOptionsButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetModal = document.getElementById(button.dataset.target);
            if (targetModal) {
                targetModal.classList.add("show");
                targetModal.style.display = "flex";
            }
        });
    });

    // Fecha a modal quando o botão de fechar é clicado
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300); // Espera a transição de opacidade antes de esconder
        });
    });

    // Fecha a modal se o usuário clicar fora da área de conteúdo
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
});

/*
document.addEventListener('DOMContentLoaded', function () {
    // Configuração do botão flutuante
    const mainFab = document.getElementById('main-fab');
    const fabOptions = document.getElementById('fab-options');

    if (mainFab && fabOptions) {
        mainFab.addEventListener('click', function () {
            if (fabOptions.style.display === 'none' || fabOptions.style.display === '') {
                fabOptions.style.display = 'flex'; // Exibe as opções
            } else {
                fabOptions.style.display = 'none'; // Oculta as opções
            }
        });
    }

    // Restante do seu código existente...
    const fabOptionsButtons = document.querySelectorAll(".fab-option");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    // Garante que todas as modais estejam escondidas
    modals.forEach(modal => {
        modal.style.display = "none";
    });

    // Adiciona evento de clique para abrir a modal correspondente
    fabOptionsButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetModal = document.getElementById(button.dataset.target);
            if (targetModal) {
                targetModal.classList.add("show");
                targetModal.style.display = "flex";
            }
        });
    });

    // Fecha a modal quando o botão de fechar é clicado
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300); // Espera a transição de opacidade antes de esconder
        });
    });

    // Fecha a modal se o usuário clicar fora da área de conteúdo
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
});
*/

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

/*
// Função para salvar dados no Firestore
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
        const docRef = await db.collection("orcamentos").add(orcamento);
        alert("Orçamento salvo com sucesso! ID do documento: " + docRef.id);
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Erro ao salvar orçamento.");
    }
}

window.saveDataToFirestore = saveDataToFirestore;
*/
/*
// Função para salvar dados no Firestore
export async function saveDataToFirestore() {
    const companyForm = document.getElementById('companyForm');
    const clientForm = document.getElementById('clientForm');
    const serviceForm = document.getElementById('serviceForm');
    
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

    // Dados dos equipamentos
    const equipmentData = [];
    const codes = document.querySelectorAll('.codeEquipment');
    const names = document.querySelectorAll('.nameEquipment');
    const quantities = document.querySelectorAll('.quantityEquipment');
    const unitPrices = document.querySelectorAll('.unitPriceEquipment');
    const subtotals = document.querySelectorAll('.subtotalEquipment');

    const observations = document.getElementById('observations').value

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

    try {
        const docIssuingCompany = await db.collection("empresasEmitenteOrcamento").add(issuingCompany)
        const docClient = await db.collection("clientes").add(clientFormData)
        const docService = await db.collection("servicos").add({ services: serviceData })
        const docEquipment = await db.collection("equipamentos").add({ equipments: equipmentData })
        const observationsData = await db.collection("observations").add({ observations: observations })
        alert("Dados salvos com sucesso! ID do documento: " + docIssuingCompany.id);
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Erro ao salvar dados.");
    }
}


window.saveDataToFirestore = saveDataToFirestore;
*/

// Função para adicionar novo serviço
document.getElementById('add-service-btn').addEventListener('click', function () {
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

document.getElementById('equipments-container').addEventListener('input', function (event) {
    const equipmentItem = event.target.closest('.equipment-item');
    const quantity = equipmentItem.querySelector('.quantityEquipment').value;
    const unitPrice = equipmentItem.querySelector('.unitPriceEquipment').value;
    const subtotal = equipmentItem.querySelector('.subtotalEquipment');

    // Cálculo do subtotal
    const calculatedSubtotal = parseFloat(quantity) * parseFloat(unitPrice || 0);
    subtotal.value = calculatedSubtotal ? `R$ ${calculatedSubtotal.toFixed(2)}` : '';
});

document.getElementById('add-equipment-btn').addEventListener('click', function () {
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

// Obtendo referência à checkbox e ao botão
const includeEquipmentsCheckbox = document.getElementById('includeEquipments');
const materialsBtn = document.getElementById('materials-btn');

// Evento para exibir ou ocultar o botão com base no estado da checkbox
includeEquipmentsCheckbox.addEventListener('change', function () {
    if (includeEquipmentsCheckbox.checked) {
        materialsBtn.style.display = 'block'; // Exibe o botão
    } else {
        materialsBtn.style.display = 'none'; // Oculta o botão
    }
});

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

document.addEventListener("DOMContentLoaded", () => {
    const fabOptions = document.querySelectorAll(".fab-option");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    // Garante que todas as modais estejam escondidas
    modals.forEach(modal => {
        modal.style.display = "none";
    });

    // Adiciona evento de clique para abrir a modal correspondente
    fabOptions.forEach(button => {
        button.addEventListener("click", () => {
            const targetModal = document.getElementById(button.dataset.target);
            if (targetModal) {
                targetModal.classList.add("show");
                targetModal.style.display = "flex";
            }
        });
    });

    // Fecha a modal quando o botão de fechar é clicado
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300); // Espera a transição de opacidade antes de esconder
        });
    });

    // Fecha a modal se o usuário clicar fora da área de conteúdo
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
});

document.addEventListener('DOMContentLoaded', function () {
    const editableText = document.getElementById('nome-empresa');

    // Quando o campo perde o foco, salva o valor (se necessário)
    editableText.addEventListener('blur', function () {
        // Aqui você pode adicionar lógica para salvar o valor no banco de dados, se necessário
        console.log('Nome atualizado:', editableText.value);
    });

    // Opcional: Permitir que o Enter salve e saia do modo de edição
    editableText.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            editableText.blur(); // Remove o foco do campo
        }
    });
});