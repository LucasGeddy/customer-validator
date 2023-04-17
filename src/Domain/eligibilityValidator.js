function validate(customerData) {
    const classesDeConsumoElegiveis = ['comercial', 'residencial', 'industrial'];
    const modalidadesTarifariasElegiveis = ['convencional', 'branca'];
    const consumoMinimo = 
        customerData.tipoDeConexao === 'monofasico' ? 400 : 
        customerData.tipoDeConexao === 'bifasico' ? 500 :
        customerData.tipoDeConexao === 'trifasico' ? 750 : 0;
    const ineligibilityErrors = [];
    console.log(`consumoMinimo: ${consumoMinimo} ---- mediaAnual: ${customerData.consumoMedioAnual}`);

    if (!classesDeConsumoElegiveis.includes(customerData.classeDeConsumo))
        ineligibilityErrors.push('Classe de consumo não aceita');
    if (!modalidadesTarifariasElegiveis.includes(customerData.modalidadeTarifaria))
        ineligibilityErrors.push('Modalidade tarifária não aceita');
    if (customerData.consumoMedioAnual <= consumoMinimo)
        ineligibilityErrors.push('Consumo muito baixo para tipo de conexão');

    return ineligibilityErrors;
}

module.exports = validate;