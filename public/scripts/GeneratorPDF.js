import { HeaderStyles, ColumnStyles } from "./TableStyles.js"

export async function generatorPDF(uploadedLogo) {
    const { jsPDF } = window.jspdf

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    })

    function updateLastTablePosition() {
        return doc.lastAutoTable.finalY + 1 || 0
    }

    let lastTable = 5

    const margin = { top: 2, bottom: 2, left: 5, right: 5 }

    const issuingCompany = {
        nameBusiness: document.getElementById("nameBusiness").value,
        fantasyName: document.getElementById("fantasyName").value,
        cpfCnpj: document.getElementById("cpfCnpj").value,
        street: document.getElementById("address").value,
        numberAddress: document.getElementById("numberAddress").value,
        state: document.getElementById("state").value,
        neighborhood: document.getElementById("neighborhood").value,
        city: document.getElementById("city").value,
        zipcode: document.getElementById("zipcode").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
    }

    const client = {
        nameClient: document.getElementById('nameClient').value,
        cpfCNPJClient: document.getElementById('cpfCNPJClient').value,
        fantasyNameClient: document.getElementById('fantasyNameClient').value,
        streetClient: document.getElementById("streetClient").value,
        numberAddressClient: document.getElementById("numberAddressClient").value,
        stateClient: document.getElementById("stateClient").value,
        neighborhoodClient: document.getElementById("neighborhoodClient").value,
        cityClient: document.getElementById("cityClient").value,
        zipcodeClient: document.getElementById("zipcodeClient").value,
        phoneClient: document.getElementById("phoneClient").value,
        emailClient: document.getElementById("emailClient").value,
    }

    const observations = document.getElementById('observations').value

    // Verifique o estado do checkbox
    const includeEquipments = document.getElementById('includeEquipments').checked;

    // Usar a imagem enviada, se disponível
    if (uploadedLogo) {
        doc.addImage(uploadedLogo, 'PNG', 1, 1, 50, 50); // Adiciona a imagem enviada
        lastTable = 50; // Ajusta a posição com base na altura da imagem + margem
    } else {
        console.warn("Nenhuma imagem enviada. Usando layout sem logo.");
        lastTable = 5; // Mantém a posição inicial se não houver logo
    }

    doc.setFontSize(10)

    const nameOrder = issuingCompany.fantasyName || issuingCompany.nameBusiness

    doc.autoTable({
        startY: lastTable,
        head: [
            [{ content: 'EMPRESA RESPONSÁVEL', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    let header = {
        startY: lastTable = updateLastTablePosition(),
        body: [
            [`${nameOrder}\nCNPJ: ${issuingCompany.cpfCnpj}\nEndereço: ${issuingCompany.street}, Nº: ${issuingCompany.numberAddress}, Bairro: ${issuingCompany.neighborhood}\nCidade: ${issuingCompany.city} - ${issuingCompany.state}, CEP: ${issuingCompany.zipcode}, Telefone para contato: ${issuingCompany.phone} \nEmail: ${issuingCompany.email}`]
        ],
        theme: 'plain',
        columnStyles: ColumnStyles.Left,
        margin: margin
    }

    doc.autoTable(header)

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'CLIENTE / CONTRATANTE', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        body: [
            [
                `Nome: ${client.nameClient}`,
                `CNPJ: ${client.cpfCNPJClient}`
            ],
            [
                `Telefone: ${client.phoneClient}`,
                `Email: ${client.emailClient}`
            ]
        ],
        columnStyles: ColumnStyles.Left,
        margin: margin,
    })

    doc.autoTable({
        startY: lastTable = updateLastTablePosition() - 1,
        body: [
            [
                `Endereço: ${client.streetClient}, ${client.numberAddressClient}, ${client.neighborhoodClient} ${client.zipcodeClient}\n ${client.cityClient} - ${client.stateClient}  `
            ],
        ],
        columnStyles: ColumnStyles.Left,
        margin: margin
    })

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'SERVIÇOS QUE SERÃO REALIZADOS', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    const services = [];

    const descriptionServices = document.querySelectorAll('.descriptionService');
    const amountServices = document.querySelectorAll('.amountService');

    // Coletar todos os serviços
    for (let i = 0; i < descriptionServices.length; i++) {
        services.push({
            descriptionService: descriptionServices[i].value,
            amountService: amountServices[i].value
        });
    }

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [['DESCRIÇÃO DO SERVIÇO', 'VALOR DO SERVIÇO']],
        body: services.map(service => [
            service.descriptionService,
            service.amountService
        ]),
        headStyles: { fillColor: [0, 0, 6], halign: 'center', lineWidth: 0.5, },
        columnStyles: {
            1: { cellWidth: 100, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' },
        },
        margin: { left: 5, right: 5 }
    });

    let totalEquipments = 0; 

    if (includeEquipments) {

        doc.autoTable({
            startY: lastTable = updateLastTablePosition(),
            head: [
                [{ content: 'EQUIPAMENTOS NECESSÁRIOS', colSpan: 2 }]
            ],
            headStyles: HeaderStyles.CellPadding,
            margin: margin,
        })

        const equipments = [];
        const codes = document.querySelectorAll('.codeEquipment');
        const names = document.querySelectorAll('.nameEquipment');
        const quantities = document.querySelectorAll('.quantityEquipment');
        const unitPrices = document.querySelectorAll('.unitPriceEquipment');
        const subtotals = document.querySelectorAll('.subtotalEquipment');

        for (let i = 0; i < codes.length; i++) {
            equipments.push({
                code: codes[i].value,
                name: names[i].value,
                quantity: quantities[i].value,
                unitPrice: unitPrices[i].value,
                subtotal: subtotals[i].value
            });
        }

        // Adicione a tabela de equipamentos ao PDF
        doc.autoTable({
            startY: lastTable = updateLastTablePosition(),
            head: [['Código', 'Nome', 'Quantidade', 'Preço unitário', 'Subtotal']],
            body: equipments.map(equipment => [
                equipment.code,
                equipment.name,
                equipment.quantity,
                formatCurrency(parseCurrency(equipment.unitPrice)),
                formatCurrency(parseCurrency(equipment.subtotal))
            ]),
            headStyles: { fillColor: [0, 0, 0], halign: 'center', lineWidth: 0.5 },
            columnStyles: {
                0: { cellWidth: 20, halign: 'center' },
                1: { cellWidth: 70, halign: 'center' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 40, halign: 'center' },
                4: { cellWidth: 40, halign: 'center' },
            },
            margin: { left: 5, right: 5 }
        });

        // Total de equipamentos
        totalEquipments = equipments.reduce((sum, equipment) => {
            const quantity = parseFloat(equipment.quantity) || 0;
            const unitPrice = parseCurrency(equipment.unitPrice); // Converte o preço unitário
            const subtotal = quantity * unitPrice; // Calcula o subtotal
            return sum + subtotal;
        }, 0);

    }

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'VALOR TOTAL DO ORÇAMENTO', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    // Função para tratar e converter valores monetários
    function parseCurrency(value) {
        if (!value) return 0;
        return parseFloat(
            value.replace('R$', '') // Remove o símbolo de moeda
                .replace(/\./g, '') // Remove separadores de milhar
                .replace(',', '.') // Substitui vírgula por ponto para formato numérico
                .trim() // Remove espaços extras
        ) || 0; // Retorna 0 se o resultado for NaN
    }

    // Total de serviços
    const totalServices = services.reduce((sum, service) => {
        const value = parseCurrency(service.amountService);
        return sum + value;
    }, 0);


    // Total geral
    /*
    
    console.log("Serviços:", services);
    console.log("Total de serviços:", totalServices);
    
    console.log("Equipamentos:", equipments);
    console.log("Total de equipamentos:", totalEquipments);
    
    console.log("Total geral:", totalBudget);
    */

    let totalBudget;

    if (includeEquipments) {
        totalBudget = totalServices + totalEquipments;
    } else {
        totalBudget = totalServices
    }

    // Adiciona a linha do valor total à tabela
    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        columnStyles: ColumnStyles.Left,
        body: [
            [
                { content: formatCurrency(totalBudget), styles: { halign: 'left', fontStyle: 'bold', fontSize: 15 } }
            ]
        ],
        margin: { left: 5, right: 5 },
    });

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'OBSERVAÇÕES GERAIS', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })


    function getValidityDate() {
        const validityDate = new Date();
        validityDate.setDate(validityDate.getDate() + 15);
        return formatCurrentDate(validityDate);
    }

    const validityDate = getValidityDate();


    doc.autoTable({
        startY: lastTable = updateLastTablePosition() - 1,
        body: [
            [
                `Orçamento válido até ${validityDate}\n\n${observations}`,
            ]
        ],
        columnStyles: ColumnStyles.Left,
        margin: margin
    })

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'ASSINATURAS', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    doc.autoTable({
        startY: lastTable = updateLastTablePosition() - 1,
        body: [
            [
                { content: ``, styles: { fontSize: 2, halign: 'center', cellPadding: 10 } },
                { content: ``, styles: { fontSize: 2, halign: 'center', cellPadding: 10 } }
            ]
        ],
        columnStyles: ColumnStyles.Center,
        margin: margin
    })

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function formatCurrentDate(date) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear();

        return `${day}-${month}-${year}`
    }

    const now = new Date()
    const formattedDate = formatCurrentDate(now)

    doc.save(`Orçamento_${nameOrder}_${formattedDate}.pdf`)
}