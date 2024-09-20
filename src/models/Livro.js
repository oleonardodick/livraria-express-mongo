import mongoose from 'mongoose';

const livroSchema = new mongoose.Schema(
  {
    id: { type: String },
    titulo: {
      type: String,
      required: [true, 'O título do livro é obrigatório'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'autores',
      required: [true, 'O autor(a) é obrigatório(a)'],
    },
    editora: {
      type: String,
      required: [true, 'A editora é obrigatória'],
      //A seguinte validação serve para bloquear dados fora do que foi definido.
      //O VALUE serve para buscar o dado informado e imprimir no texto.
      enum: {
        values: ['Clássicos', 'Alura'],
        message: 'A editora {VALUE} não é um valor permitido.',
      },
    },
    numeroPaginas: {
      type: Number,
      // min: [10, 'O número de páginas não pode ser menor que 10'],
      // max: [5000, 'O número de páginas não pode ser maior que 5000'],
      //Exemplo de validador personalizado do mongoose
      validate: {
        validator: (valor) => {
          return valor >= 10 && valor <= 5000;
        },
        message:
          'O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}',
      },
    },
  },
  {
    versionKey: false,
  }
);

//primeiro parâmetro é a coleção criada no banco
const livros = mongoose.model('livros', livroSchema);

export default livros;
