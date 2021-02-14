const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'node-mysql',
    database: 'agenda_petshop'
});

module.exports = conexao;
