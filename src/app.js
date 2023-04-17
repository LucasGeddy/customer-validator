const express = require('express');
const requestValidator = require('./API/Validators/elegibilidadeRequestValidator');
const validarElegibilidadeConsumidor = require('./API/elegibilidadeConsumidorService');

class AppController {
    constructor() {
        this.express = express();
        
        this.express.use(express.json());
        this.express.post('/', 
            (req, res, next) => requestValidator(req, res, next), 
            (req, res) => validarElegibilidadeConsumidor(req, res)
        );
    }
}

module.exports = new AppController().express;