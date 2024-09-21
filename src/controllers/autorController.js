import { autores } from '../models/index.js';
import NaoEncontrado from '../erros/NaoEncontrado.js';

class AutorController {
  static listarAutores = async (req, res, next) => {
    try {
      const autoresResultado = autores.find();
      req.resultado = autoresResultado;
      next();
    } catch (erro) {
      next(erro);
    }
  };

  static listarAutorPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const autorResultado = await autores.findById(id);

      if (autorResultado) {
        res.status(200).send(autorResultado);
      } else {
        next(AutorNaoLicalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarAutor = async (req, res, next) => {
    try {
      let autor = new autores(req.body);

      const autorResultado = await autor.save();

      res.status(201).send(autorResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarAutor = async (req, res, next) => {
    try {
      const id = req.params.id;

      await autores.findByIdAndUpdate(id, { $set: req.body });

      if (autores) {
        res.status(200).send({ message: 'Autor atualizado com sucesso' });
      } else {
        next(AutorNaoLicalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirAutor = async (req, res, next) => {
    try {
      const id = req.params.id;

      await autores.findByIdAndDelete(id);

      if (autores) {
        res.status(200).send({ message: 'Autor removido com sucesso' });
      } else {
        next(AutorNaoLicalizado());
      }
    } catch (erro) {
      next(erro);
    }
  };
}

function AutorNaoLicalizado() {
  return new NaoEncontrado('Autor não localizado');
}

export default AutorController;
