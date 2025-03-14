export function parseCurrency(value) {
    if (!value) return 0
    const cleanValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    return parseFloat(cleanValue) || 0
}

export function toggleButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId)
    const spinner = button.querySelector('.spinner')

    if (isLoading) {
        button.disabled = true
        spinner.style.display = 'inline-block'
    } else {
        button.disabled = false
        spinner.style.display = 'none'
    }
}