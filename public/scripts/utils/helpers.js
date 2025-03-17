export function parseCurrency(value) {
    if (!value) return 0
    const cleanValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    return parseFloat(cleanValue) || 0
}

export function toggleButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId)
    if (!button) {
        console.error(`Botão com ID '${buttonId}' não encontrado.`)
        return
    }
    const spinner = button.querySelector('.spinner')
    if (!spinner) {
        console.error(`Spinner não encontrado dentro do botão com ID '${buttonId}'.`)
        return
    }

    if (isLoading) {
        button.disabled = true
        spinner.style.display = 'inline-block'
    } else {
        button.disabled = false
        spinner.style.display = 'none'
    }
}