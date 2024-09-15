import mongoose from 'mongoose';

/*essa variável DB_CONNECTION_STRING foi criada em um arquivo .env
criado na raiz do projeto. Para funcionar deve ser instalado o dotenv
e depois iniciado o dotenv no ponto mais inicial do projeto, nesse caso
no arquivo server.js*/
async function conectaNaDatabase() {
  mongoose.connect(process.env.DB_CONNECTION_STRING);

  return mongoose.connection;
}

export default conectaNaDatabase;
