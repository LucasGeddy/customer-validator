function calcularEconomiaDeCarbono(consumoMensalDeEnergia) {
    return Number((consumoMensalDeEnergia * 12 * 0.084).toFixed(2));
}

module.exports = calcularEconomiaDeCarbono;