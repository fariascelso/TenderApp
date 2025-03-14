export function applyInputMasks(container) {
    if (typeof IMask === 'undefined') {
        console.error('IMask não está carregado. Verifique se o script foi incluído corretamente.')
        return
    }

    const inputs = container.querySelectorAll('input')
    inputs.forEach(input => {
        if (input.classList.contains('unitPriceEquipment')) {
            input.addEventListener('input', () => {
                let value = input.value.replace(/\D/g, '')
                value = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                input.value = value
            })
        }
    })

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