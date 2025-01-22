import { HeaderStyles, ColumnStyles } from "./TableStyles.js"

export async function generatorPDF() {
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

    const imageUrl = '../logo.png';
    const image = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("Imagem carregada com sucesso");
                resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => {
            console.error("Erro ao carregar a imagem");
            reject();
        };
        xhr.open('GET', imageUrl);
        xhr.responseType = 'blob';
        xhr.send();
    });

    // Verifique se a imagem foi carregada
    if (image) {
        doc.addImage(image, 'PNG', 1, 1, 50, 50);
        lastTable = 50
    } else {
        console.error("Erro ao carregar a imagem");
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
        headStyles: { fillColor: [66, 66, 66], halign: 'center', lineWidth: 0.5, },
        columnStyles: {
            1: { cellWidth: 100, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' },
        },
        margin: { left: 5, right: 5 }
    });

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
            equipment.unitPrice,
            equipment.subtotal
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
                `Orçamento válido até ${validityDate}\n\n${ observations}`,
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