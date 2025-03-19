import { applyInputMasks } from './utils/inputMasks.js'

export function fillEquipmentData() {
    const equipmentsContainer = document.getElementById('equipments-container')
    if (!equipmentsContainer) {
        console.warn('Elemento "equipments-container" não encontrado. Função ignorada.')
        return
    }

    const equipmentSelect = document.getElementById('equipmentSelect')
    const selectedData = equipmentSelect.value

    if (!selectedData) return

    const data = JSON.parse(selectedData)

    const newEquipmentItem = document.createElement('div')
    newEquipmentItem.classList.add('equipment-item')

    newEquipmentItem.innerHTML = `
        <div class="equipment-row">
            <div class="field-group code-name">
                <label for="codeEquipment">Código:</label>
                <input type="text" class="codeEquipment" value="${data.codeEquipment || ''}" placeholder="Código do equipamento">
            </div>
            <div class="field-group code-name">
                <label for="nameEquipment">Nome:</label>
                <input type="text" class="nameEquipment" value="${data.nameEquipment || ''}" placeholder="Nome do equipamento">
            </div>
        </div>
        <div class="equipment-row">
            <div class="field-group quantity-price-subtotal">
                <label for="quantityEquipment">Quantidade:</label>
                <input type="number" class="quantityEquipment" placeholder="Qtd." min="1">
            </div>
            <div class="field-group quantity-price-subtotal">
                <label for="unitPriceEquipment">Preço Unitário:</label>
                <input type="text" class="unitPriceEquipment" value="${data.unitPriceEquipment || ''}" placeholder="Preço unitário">
            </div>
            <div class="field-group quantity-price-subtotal">
                <label for="subtotalEquipment">Subtotal:</label>
                <input type="text" class="subtotalEquipment" placeholder="Subtotal" readonly>
            </div>
        </div>
    `

    equipmentsContainer.appendChild(newEquipmentItem)
    applyInputMasks(newEquipmentItem)
}

export function fillServiceData() {
    const serviceSelect = document.getElementById('serviceSelect')
    const selectedData = serviceSelect.value

    if (!selectedData) return

    const data = JSON.parse(selectedData)

    const servicesContainer = document.getElementById('services-container')

    const newServiceItem = document.createElement('div')
    newServiceItem.classList.add('service-item')

    newServiceItem.innerHTML = `
        <label for="descriptionService">Descrição do Serviço:</label>
        <input type="text" class="descriptionService" value="${data.descriptionService || ''}" placeholder="Descrição do serviço">

        <label for="amountService">Valor do Serviço:</label>
        <input type="text" class="amountService" value="${data.amountService || ''}" placeholder="Valor do serviço">
    `

    servicesContainer.appendChild(newServiceItem)
    applyInputMasks(newServiceItem)
}