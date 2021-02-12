const moment = require('moment');
const conexao = require('../infra/connection');

class Atendimentos {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos três caracteres'
            }
        ];

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros) {
            res.status(400).json(erros);
        } else {
            const atendimentoDatado = {
                ...atendimento, 
                dataCriacao, 
                data
            };
    
            const sql = `INSERT INTO Atendimentos SET ?`;
    
            conexao.query(sql, atendimentoDatado, (error, result) => {
                if(error) {
                    res.status(400).json(error);
                } else {
                    res.status(201).json(result);
                }
            });
        }
    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (err, result) => {
            if(err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(result);
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, (err, result) => {
            if(err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(result[0]);
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, result) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(result);
            }
        });
    }
}

module.exports = new Atendimentos;
