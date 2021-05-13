import Aula from '../models/aula.model';
import CursoRepository from '../repositories/curso.repository';
import ProfessorRepository from '../repositories/professor.repository';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AulaController {
  async obterPorId(id: number, idCurso: number): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas.find((a) => a.id === id);
  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    if (!curso) {
      throw new BusinessException('Curso não existe.');
    }
    return curso.aulas;
  }

  async incluir(aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ nome }, { duracao }, { topicos }, { idCurso }]);

    const curso = await CursoRepository.obterPorId(idCurso);
    if (!curso) {
      throw new BusinessException('Curso não existe.');
    }

    const existeAula = curso.aulas.filter(aula => aula.nome === nome);

    if (existeAula.length > 0) {
      throw new BusinessException('Nome da aula já existe.');
    }

    const idAnterior = curso.aulas[curso.aulas.length - 1].id;
    aula.id = idAnterior ? idAnterior + 1 : 1;
    curso.aulas.push(aula);

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula incluido com sucesso!', {
      id: aula.id,
      idCurso,
    });
  }

  async alterar(id: number, aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    const curso = await CursoRepository.obterPorId(idCurso);
    if (!curso) {
      throw new BusinessException('Curso não existe.');
    }

    const existeAula = curso.aulas.filter(aula => aula.id === id);

    if (existeAula.length === 0) {
      throw new BusinessException('Aula não existe.');
    }

    curso.aulas.map((aulaTemp) => {
      if (aulaTemp.id === id) {
        Object.keys(aula).forEach((key) => {
          aulaTemp[key] = aula[key];
        });
      }
    });

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
      idCurso,
    });
  }

  async excluir(id: number, idCurso: number) {
    Validador.validarParametros([{ id }, { idCurso }]);

    const curso = await CursoRepository.obterPorId(idCurso);
    if (!curso) {
      throw new BusinessException('Curso não existe.');
    }

    const existeAula = curso.aulas.filter(aula => aula.id === id);

    if (existeAula.length === 0) {
      throw new BusinessException('Aula não existe.');
    }

    curso.aulas = curso.aulas.filter((aula) => aula.id !== id);

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula excluido com sucesso!');
  }
}
