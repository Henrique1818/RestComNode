const conexao = require('../infra/connection');
const uploadDeArquivos = require('../files/uploadFiles');

class Pet {
    adicionar(pet, res) {
        const query = 'INSERT INTO Pets SET ?';

        uploadDeArquivos(pet.imagem, pet.nome, novoCaminho => {
            const novoPet = { nome: pet.nome, imagem: novoCaminho };

            conexao.query(query, novoPet, erro => {
                if(erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(200).json(novoPet);
                }
            });
        });

    }
}

module.exports = new Pet();