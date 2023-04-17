const validar = require('../../src/Domain/elegibilidadeValidator');

describe('ElegibilidadeValidador', () => {
    it('Should return empty array when all criteria are met', () => {
        const dadosConsumidorValidos = {
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "comercial",
            "modalidadeTarifaria": "convencional"
        };
        const consumoMedioMensal = 501;

        const result = validar(dadosConsumidorValidos, consumoMedioMensal);

        expect(result).toEqual([]);
    });

    it ('Should return all reasons for ineligibility when all criteria is not met', () => {
        const dadosConsumidorInelegivel = {
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "rural",
            "modalidadeTarifaria": "verde"
        };
        const consumoMedioMensal = 500;

        const motivosEsperados = [
            "Classe de consumo não aceita",
            "Modalidade tarifária não aceita",
            "Consumo muito baixo para tipo de conexão"
        ];

        const result = validar(dadosConsumidorInelegivel, consumoMedioMensal);

        motivosEsperados.forEach(motivoEsperado => expect(result).toContain(motivoEsperado));
    });
});