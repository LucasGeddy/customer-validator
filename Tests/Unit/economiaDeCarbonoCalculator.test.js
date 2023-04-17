const calcularEconomiaDeCarbono = require('../../src/Domain/economiaDeCarbonoCalculator');

describe('CalculadoraEconomiaDeCarbono', () => {
    it('Should return empty array when all criteria are met', () => {
        const consumo = 5000;

        const resultadoEsperado = 5040;

        const result = calcularEconomiaDeCarbono(consumo);

        expect(result).toEqual(resultadoEsperado);
    });
});