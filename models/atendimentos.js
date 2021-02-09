const moment = require('moment');
const conexao = require('../infra/connection');

class Atendimentos {
    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const atendimentoDatado = {
            ...atendimento, 
            dataCriacao, 
            data
        };

        console.log(atendimentoDatado);

        const sql = `INSERT INTO Atendimentos SET ?`;

        conexao.query(sql, atendimentoDatado, (error, result) => {
            if(error) {
                console.log(error);
            } else {
                console.log(result);
            }
        });
    }
}

module.exports = new Atendimentos;
