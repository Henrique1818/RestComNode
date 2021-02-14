const { default: axios } = require('axios');
const moment = require('moment');
const conexao = require('../infra/database/connection');
const atendimentos = require('../repository/atendimentos');
const repositorio = require('../repository/atendimentos');

class Atendimentos {
    constructor() {
        this.dataEhValida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao);
        this.clienteEhValido = tamanho => tamanho >= 5;
        this.valida = parametros => this.validacoes.filter(campos => {
            const { nome } = campos;
            const parametro = parametros[nome];

            return !campos.valido(parametro);
        });

        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos três caracteres'
            }
        ];
    }

    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const parametros = {
            data: {data, dataCriacao},
            cliente: { tamanho: atendimento.cliente.length }
        };

        const erros = this.valida(parametros);
        const existemErros = erros.length;

        if(existemErros) {
            return new Promise((resolve, reject) => reject(erros));
        } else {
            const atendimentoDatado = {
                ...atendimento, 
                dataCriacao, 
                data
            };
    
            return repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.inserId;
                    return { ...atendimento, id };
                })
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

        conexao.query(sql, async (err, result) => {
            const atendimento = result[0];
            const cpf = atendimento.cliente;

            if(err) {
                res.status(400).json(err);
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`);

                atendimento.cliente = data;
                
                res.status(200).json(atendimento);
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({...valores, id});
            }
        });
    }

    delete(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?';

        conexao.query(sql, id, (erro) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }
        });
    }
}

module.exports = new Atendimentos;
