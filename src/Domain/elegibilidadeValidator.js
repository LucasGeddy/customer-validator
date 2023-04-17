function validar(dadosConsumidor, consumoMedioMensal) {
    const classesDeConsumoElegiveis = ['comercial', 'residencial', 'industrial'];
    const modalidadesTarifariasElegiveis = ['convencional', 'branca'];
    const consumoMinimo = 
        dadosConsumidor.tipoDeConexao === 'monofasico' ? 400 : 
        dadosConsumidor.tipoDeConexao === 'bifasico' ? 500 :
        dadosConsumidor.tipoDeConexao === 'trifasico' ? 750 : 0;
    const errosIneligibilidade = [];

    if (!classesDeConsumoElegiveis.includes(dadosConsumidor.classeDeConsumo))
        errosIneligibilidade.push('Classe de consumo não aceita');
    if (!modalidadesTarifariasElegiveis.includes(dadosConsumidor.modalidadeTarifaria))
        errosIneligibilidade.push('Modalidade tarifária não aceita');
    if (consumoMedioMensal <= consumoMinimo)
        errosIneligibilidade.push('Consumo muito baixo para tipo de conexão');

    return errosIneligibilidade;
}

module.exports = validar;