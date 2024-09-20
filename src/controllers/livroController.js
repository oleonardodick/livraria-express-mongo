import NaoEncontrado from '../erros/NaoEncontrado.js';
import { livros } from '../models/index.js';

class LivroController {
  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find().populate('autor').exec();

      res.status(200).json(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      /*o populate é utilizado para definir quais campos se deseja retornar do objeto autor.
      Caso quisesse trazer mais dados, poderia ser populate('autor', 'nome nacionalidade')*/
      const livroResultados = await livros
        .findById(id)
        .populate('autor', 'nome')
        .exec();

      if (livroResultados) {
        res.status(200).send(livroResultados);
      } else {
        next(LivroNaoLocalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndUpdate(id, { $set: req.body });

      if (livros) {
        res.status(200).send({ message: 'Livro atualizado com sucesso' });
      } else {
        next(LivroNaoLocalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      if (livros) {
        res.status(200).send({ message: 'Livro removido com sucesso' });
      } else {
        next(LivroNaoLocalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorEditora = async (req, res, next) => {
    try {
      const editora = req.query.editora;

      const livrosResultado = await livros.find({ editora: editora });

      res.status(200).send(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  };
}

function LivroNaoLocalizado() {
  return new NaoEncontrado('Livro não localizado');
}

export default LivroController;
