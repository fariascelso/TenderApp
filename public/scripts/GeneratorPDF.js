import { HeaderStyles, ColumnStyles, COLORS } from "./TableStyles.js"

export async function generatorPDF(uploadedLogo, orderNumber) {
    const { jsPDF } = window.jspdf

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    })

    function updateLastTablePosition() {
        return doc.lastAutoTable.finalY + 1 || 5
    }

    let lastTable = 5

    const margin = { top: 2, bottom: 2, left: 5, right: 5 }
    const pageWidth = doc.internal.pageSize.getWidth()

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
    const includeEquipments = document.getElementById('includeEquipments').checked

    if (uploadedLogo) {
        const logoWidth = 25
        const logoHeight = 25
        const logoX = margin.left
        const logoY = 5

        doc.addImage(uploadedLogo, 'PNG', logoX, logoY, logoWidth, logoHeight)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        const orderNumberText = `Nº da Proposta: ${orderNumber}`
        const orderNumberWidth = doc.getTextWidth(orderNumberText)
        const orderNumberX = pageWidth - margin.right - orderNumberWidth
        doc.text(orderNumberText, orderNumberX, logoY + 10)
            
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        const currentDate = new Date()
        const dateText = `Data: ${formatDate(currentDate, '/')}`
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, orderNumberX, logoY + 15)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')

        lastTable = logoY + logoHeight + 5
    } else {
        console.warn("Nenhuma imagem enviada. Usando layout sem logo.")
        lastTable = 5
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

    const services = []

    const descriptionServices = document.querySelectorAll('.descriptionService')
    const amountServices = document.querySelectorAll('.amountService')

    for (let i = 0; i < descriptionServices.length; i++) {
        services.push({
            descriptionService: descriptionServices[i].value,
            amountService: amountServices[i].value
        })
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
    })

    let totalEquipments = 0

    if (includeEquipments) {

        doc.autoTable({
            startY: lastTable = updateLastTablePosition(),
            head: [
                [{ content: 'EQUIPAMENTOS NECESSÁRIOS', colSpan: 2 }]
            ],
            headStyles: HeaderStyles.CellPadding,
            margin: margin,
        })

        const equipments = []
        const codes = document.querySelectorAll('.codeEquipment')
        const names = document.querySelectorAll('.nameEquipment')
        const quantities = document.querySelectorAll('.quantityEquipment')
        const unitPrices = document.querySelectorAll('.unitPriceEquipment')
        const subtotals = document.querySelectorAll('.subtotalEquipment')

        for (let i = 0; i < codes.length; i++) {
            equipments.push({
                code: codes[i].value,
                name: names[i].value,
                quantity: quantities[i].value,
                unitPrice: unitPrices[i].value,
                subtotal: subtotals[i].value
            })
        }

        const equipmentData = equipments.map((equipment) => [
            equipment.code,
            equipment.name,
            equipment.quantity,
            equipment.unitPrice,
            equipment.subtotal,
        ])

        doc.autoTable({
            startY: (lastTable = updateLastTablePosition()),
            head: [["Código", "Nome", "Quantidade", "Preço unitário", "Subtotal"]],
            body: equipmentData,
            headStyles: HeaderStyles.Materials,
            columnStyles: ColumnStyles.Materials,
            styles: {
                overflow: "linebreak", // Permite quebra de texto
                cellPadding: 4, // Aumentado para melhor legibilidade
                fontSize: 7,
            },
            didParseCell: (data) => {
                if (data.section === "head") {
                    data.cell.styles.textColor = COLORS.WHITE // Garante texto branco no cabeçalho
                }
            },
            margin: margin,
        })

        totalEquipments = equipments.reduce((sum, equipment) => {
            const quantity = parseFloat(equipment.quantity) || 0
            const unitPrice = parseCurrency(equipment.unitPrice)
            const subtotal = quantity * unitPrice
            return sum + subtotal
        }, 0)
    }

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'VALOR TOTAL DO ORÇAMENTO', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    function parseCurrency(value) {
        if (!value) return 0
        return parseFloat(
            value.replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ) || 0
    }

    const totalServices = services.reduce((sum, service) => {
        const value = parseCurrency(service.amountService)
        return sum + value
    }, 0)

    let totalBudget

    if (includeEquipments) {
        totalBudget = totalServices + totalEquipments
    } else {
        totalBudget = totalServices
    }

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        columnStyles: ColumnStyles.Left,
        body: [
            [
                { content: formatCurrency(totalBudget), styles: { halign: 'left', fontStyle: 'bold', fontSize: 15 } }
            ]
        ],
        margin: { left: 5, right: 5 },
    })

    doc.autoTable({
        startY: lastTable = updateLastTablePosition(),
        head: [
            [{ content: 'OBSERVAÇÕES GERAIS', colSpan: 2 }]
        ],
        headStyles: HeaderStyles.CellPadding,
        margin: margin,
    })

    function getValidityDate() {
        const validityDate = new Date()
        validityDate.setDate(validityDate.getDate() + 15)
        return formatDate(validityDate, '/')
    }

    const validityDate = getValidityDate()

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
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    function formatDate(date, separator = '-', forFileName = false) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        if (forFileName) {
            return `${day}-${month}-${year}`
        }

        return `${day}${separator}${month}${separator}${year}`
    }

    const now = new Date()
    const formattedDate = formatDate(now, '-', true)

    doc.save(`Orçamento_${nameOrder}_${formattedDate}.pdf`)
}