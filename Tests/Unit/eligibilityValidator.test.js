const validate = require('../../src/Domain/eligibilityValidator');

describe('EligibilityValidator', () => {
    it('Should return empty array when all criteria are met', () => {
        const validCustomerData = {
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "comercial",
            "modalidadeTarifaria": "convencional",
            "consumoMedioAnual": 501
        };

        const expectedResult = [];

        const result = validate(validCustomerData);

        expect(result).toEqual(expectedResult);
    });

    it ('Should return all reasons for ineligibility when all criteria is not met', () => {
        const ineligibleCustomerData = {
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "rural",
            "modalidadeTarifaria": "verde",
            "consumoMedioAnual": 500
        };

        const expectedReasons = [
            "Classe de consumo não aceita",
            "Modalidade tarifária não aceita",
            "Consumo muito baixo para tipo de conexão"
        ];

        const result = validate(ineligibleCustomerData);

        expectedReasons.forEach(expectedReason => expect(result).toContain(expectedReason));
    });
});