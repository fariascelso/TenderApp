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