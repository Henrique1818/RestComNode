const conexao = require('../infra/connection');

class Atendimentos {
    adiciona(atendimentos) {
        const sql = `INSERT INTO Atendimentos SET ?`;

        conexao.query(sql, atendimentos, (error, result) => {
            if(error) {
                console.log(error);
            } else {
                console.log(result);
            }
        });
    }
}

module.exports = new Atendimentos;
