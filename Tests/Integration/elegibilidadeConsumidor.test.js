const request = require('supertest');
const app = require('../../src/app');

describe('ElegibilidadeConsumidorEndpoint', () => {
    it('Should return false eligibility with all reasons', async () => {
        const dadosConsumidorInelegivel = {
            "numeroDoDocumento": "14041737706",
            "tipoDeConexao": "bifasico",
            "classeDeConsumo": "rural",
            "modalidadeTarifaria": "verde",
            "historicoDeConsumo": [
              500, // mes atual
              500, // mes anterior
              500, // 2 meses atras
              500, // 3 meses atras
              500, // 4 meses atras
              500, // 5 meses atras
              500, // 6 meses atras
              500, // 7 meses atras
              500, // 8 meses atras
              500, // 9 meses atras
            ]
        }

        const respostaEsperada = {
            elegivel: false,
            razoesDeInelegibilidade: [
                    "Classe de consumo não aceita",
                    "Modalidade tarifária não aceita",
                    "Consumo muito baixo para tipo de conexão"
            ]
        };
        const response = await request(app)
            .post('/validate-customer')
            .send(dadosConsumidorInelegivel);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(respostaEsperada);
    });
    it('Should return true eligibility with correct estimated carbon economy', async () => {
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

        const response = await request(app)
            .post('/validate-customer')
            .send(dadosConsumidorElegivel);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(respostaEsperada);
    });
    it('Should return bad request with correct errors when missing required field, document with wrong length,' +
       'field with wrong type, bad value on history', async () => {
        const dadosConsumidorElegivel = {
            "numeroDoDocumento": "123",
            "tipoDeConexao": [ "bifasico", "trifasico" ],
            "modalidadeTarifaria": "diferente",
            "historicoDeConsumo": [
              3878, // mes atual
              9760, // mes anterior
              0, // 2 meses atras
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
            errors: [
                'Dados obrigatórios não foram preenchidos',
                'Tipo dos dados inválido',
                'Número do documento inválido',
                'Valores de Tipo de Conexão, Classe de Consumo ou Modalidade Tarifária inválidos',
                'Histórico de consumo inválido'
            ]
        };

        const response = await request(app)
            .post('/validate-customer')
            .send(dadosConsumidorElegivel);
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual(respostaEsperada);
    });
});