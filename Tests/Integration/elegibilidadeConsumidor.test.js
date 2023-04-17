const postEligibilidadeConsumidor = require('../../src/API/elegibilidadeConsumidorService');

describe('ElegibilidadeConsumidorEndpoint', () => {
    it('Should return false eligibility with all reasons', () => {
        const requisicaoConsumidorInelegivel = {
            body: {
                "numeroDoDocumento": "14041737706",
                "tipoDeConexao": "bifasico",
                "classeDeConsumo": "rural",
                "modalidadeTarifaria": "verde",
                "historicoDeConsumo": [
                    500, // mes atual
                    300, // mes anterior
                    400, // 2 meses atras
                    501, // 3 meses atras
                    409, // 4 meses atras
                    500, // 5 meses atras
                    500, // 6 meses atras
                    500, // 7 meses atras
                    450, // 8 meses atras
                    409, // 9 meses atras
                ]
            }
        };

        const respostaEsperada = {
            elegivel: false,
            razoesDeInelegibilidade: [
                    "Classe de consumo não aceita",
                    "Modalidade tarifária não aceita",
                    "Consumo muito baixo para tipo de conexão"
            ]
        };

        const result = postEligibilidadeConsumidor({ body: requisicaoConsumidorInelegivel });

        expect(result.staus).toEqual(200);
        expect(result.body).toEqual(respostaEsperada);
    });
    it('Should return true eligibility with correct estimated carbon economy', () => {
        const dadosConsumidorElegivel = {
            "numeroDoDocumento": "14041737706",
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "comercial",
            "modalidadeTarifaria": "convencional",
            "historicoDeConsumo": [
              3878, // mes atual
              9760, // mes anterior
              5976, // 2 meses atras
              2797, // 3 meses atras
              2481, // 4 meses atras
              5731, // 5 meses atras
              7538, // 6 meses atras
              4392, // 7 meses atras
              7859, // 8 meses atras
              4160, // 9 meses atras
              6941, // 10 meses atras
              4597  // 11 meses atras
            ]
          }

        const respostaEsperada = {
            elegivel: true,
            economiaAnualDeCO2: 5553.24
        };

        const result = postEligibilidadeConsumidor({ body: dadosConsumidorElegivel});

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(respostaEsperada);
    });
});