const util = require('util');
const cpfRegex = new RegExp('^\\d{11}$');

const cnpjRegex = new RegExp('^\\d{14}$');

const tiposDeConexao = ['monofasico', 'bifasico', 'trifasico']

const classesDeConsumo = [
'residencial',
'industrial',
'comercial',
'rural',
'poderPublico',
]

const modalidadesTarifarias = ['azul', 'branca', 'verde', 'convencional']

function validateRequest(req, res, next) {
    const dadosConsumidor = req.body;

    if (typeof(dadosConsumidor) !== 'object' ||
        !dadosConsumidor.numeroDoDocumento ||
        !(cpfRegex.test(dadosConsumidor.numeroDoDocumento) || cnpjRegex.test(dadosConsumidor.numeroDoDocumento)) ||
        !dadosConsumidor.tipoDeConexao ||
        !tiposDeConexao.includes(dadosConsumidor.tipoDeConexao) ||
        !dadosConsumidor.classeDeConsumo ||
        !classesDeConsumo.includes(dadosConsumidor.classeDeConsumo) ||
        !dadosConsumidor.modalidadeTarifaria ||
        !modalidadesTarifarias.includes(dadosConsumidor.modalidadeTarifaria) ||
        !dadosConsumidor.historicoDeConsumo ||
        dadosConsumidor.historicoDeConsumo.length < 3 || dadosConsumidor.historicoDeConsumo.length > 12)
        return res.status(400).json({ message: 'Dados inválidos.' });

    let validRequest = true;
    dadosConsumidor.historicoDeConsumo.forEach(consumo => {
        if (typeof(consumo) !== 'number' ||
            consumo <= 0 || consumo > 9999)
        {
            validRequest = false;
        }
    });

    if (!validRequest)
        return res.status(400).json({ message: 'Dados inválidos.' });
    
    next();
}

module.exports = validateRequest;