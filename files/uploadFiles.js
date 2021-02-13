const fs = require('fs');

fs.createReadStream('./assets/labrador.jpg')
    .pipe(fs.createWriteStream('./assets/labrador-stream.jpg'))
    .on('finish', () => console.log('Imagem foi escrita com sucesoo!'));