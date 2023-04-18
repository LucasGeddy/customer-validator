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
    let erros = [];

    if (!validateRequiredFields(dadosConsumidor))
        erros.push('Dados obrigatórios não foram preenchidos');

    if (!validateFieldTypes(dadosConsumidor))
        erros.push('Tipo dos dados inválido');

    if (!validateDocument(dadosConsumidor))
        erros.push('Número do documento inválido');

    if (!validateEnumContents(dadosConsumidor))
        erros.push('Valores de Tipo de Conexão, Classe de Consumo ou Modalidade Tarifária inválidos');

    if (!validateHistory(dadosConsumidor))
        erros.push('Histórico de consumo inválido');

    if (erros.length > 0)
        return res.status(400).json({ errors: erros });
    
    next();
}

const validateRequiredFields = (dadosConsumidor) =>
    (dadosConsumidor.numeroDoDocumento &&
     dadosConsumidor.tipoDeConexao &&
     dadosConsumidor.classeDeConsumo &&
     dadosConsumidor.modalidadeTarifaria &&
     dadosConsumidor.historicoDeConsumo);

const validateFieldTypes = (dadosConsumidor) =>
    (typeof(dadosConsumidor) === 'object' &&
     typeof(dadosConsumidor.numeroDoDocumento) === 'string' &&
     typeof(dadosConsumidor.tipoDeConexao) === 'string' &&
     typeof(dadosConsumidor.classeDeConsumo) === 'string' &&
     typeof(dadosConsumidor.modalidadeTarifaria) === 'string' &&
     Array.isArray(dadosConsumidor.historicoDeConsumo));

const validateDocument = (dadosConsumidor) =>
    (cpfRegex.test(dadosConsumidor.numeroDoDocumento) || cnpjRegex.test(dadosConsumidor.numeroDoDocumento));

const validateEnumContents = (dadosConsumidor) =>
    (tiposDeConexao.includes(dadosConsumidor.tipoDeConexao) &&
    classesDeConsumo.includes(dadosConsumidor.classeDeConsumo) &&
    modalidadesTarifarias.includes(dadosConsumidor.modalidadeTarifaria));

const validateHistory = (dadosConsumidor) => {
    if (dadosConsumidor.historicoDeConsumo.length < 3 || dadosConsumidor.historicoDeConsumo.length > 12)
        return false;

    let validRequest = true;
    dadosConsumidor.historicoDeConsumo.forEach(consumo => {
        if (typeof(consumo) !== 'number' ||
            consumo <= 0 || consumo > 9999)
        {
            validRequest = false;
        }
    });

    return validRequest;
}

module.exports = validateRequest;