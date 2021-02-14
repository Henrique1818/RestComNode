const customExpress = require('./config/customExpress');
const conexao = require('./infra/database/connection');
const Tabelas = require('./infra/database/tables');

conexao.connect(error => {
    if(error) {
        console.log(error);
    } else {
        console.log('conectado com sucesso!!');

        Tabelas.init(conexao);
        
        const app = customExpress();

        app.listen(3000, () => console.log('rodando na porta 3000'));
    }
});
