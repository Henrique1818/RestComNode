const Atendimentos = require('../models/atendimentos');

module.exports = app => {
    app.get('/atendimentos', (req, res) => res.send('Rota de atendimentos'));

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body;
        
        Atendimentos.adiciona(atendimento)

        res.status(201).json(atendimento);
    });
}
