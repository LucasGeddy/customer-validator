const validarElegibilidade = require('../Domain/elegibilidadeValidator');
const calcularEconomiaDeCarbono = require('../Domain/economiaDeCarbonoCalculator');

function validarElegibilidadeConsumidor(req, res) {
    const dadosConsumidor = req.body;

    const historicoDeConsumo = dadosConsumidor.historicoDeConsumo;
    let consumoMedioMensal = historicoDeConsumo.reduce((soma, consumoMensal) => soma + consumoMensal, 0) / historicoDeConsumo.length;

    const razoesInelegibilidade = validarElegibilidade(dadosConsumidor, consumoMedioMensal);

    if (razoesInelegibilidade.length > 0)
        return res.status(200).json({
            elegivel: false,
            razoesDeInelegibilidade: razoesInelegibilidade
        });

    return res.status(200).json({
        elegivel: true,
        economiaAnualDeCO2: calcularEconomiaDeCarbono(consumoMedioMensal)
    });
};

module.exports = validarElegibilidadeConsumidor;