import NaoEncontrado from '../erros/NaoEncontrado.js';
import { autores, livros } from '../models/index.js';

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

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);
      if (busca) {
        const livrosResultado = await livros.find(busca).populate('autor');

        res.status(200).send(livrosResultado);
      } else {
        res.status(200).send([]);
      }
    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;
  let busca = {};
  if (editora) busca.editora = editora;
  //solução nativa do javascript
  // const regex = new RegExp(titulo, 'i');

  // if (titulo) busca.titulo = regex;
  //solução do mongoose
  if (titulo) busca.titulo = { $regex: titulo, $options: 'i' };

  /*
    $gte: Solução mongoose para grater then or equal
    $lte: Solução mongoose para less then or equal
  */
  if (minPaginas) {
    if (maxPaginas) {
      busca.numeroPaginas = {
        $gte: minPaginas,
        $lte: maxPaginas,
      };
    } else {
      busca.numeroPaginas = { $gte: minPaginas };
    }
  } else if (maxPaginas) {
    busca.numeroPaginas = { $lte: maxPaginas };
  }

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });
    if (autor) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }
  }

  return busca;
}

function LivroNaoLocalizado() {
  return new NaoEncontrado('Livro não localizado');
}

export default LivroController;
