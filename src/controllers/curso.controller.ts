import Curso from '../entities/curso.entity';
import AlunoCursoRepository from '../repositories/aluno-curso.repository';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class CursoController {
  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    return await CursoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }

  async incluir(curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ nome }, { descricao }, { aulas }, { idProfessor }]);

    const existeCurso = await CursoRepository.obter({ nome: { $eq: nome } });
    if (existeCurso) {
      throw new BusinessException('Curso já existe.');
    }

    const id = await CursoRepository.incluir(curso);

    return new Mensagem('Curso incluido com sucesso!', {
      id,
    });
  }
  
  async alterar(id: number, curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    const existeCurso = await CursoRepository.obter({ nome: { $eq: nome } });
    if (existeCurso) {
      throw new BusinessException('Curso já existe');
    }

    await CursoRepository.alterar({ id }, curso);

    return new Mensagem('Curso alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    const curso = await CursoRepository.obterPorId(id);

    const existeMatricula = await AlunoCursoRepository.obter({ idCurso: { $eq: curso.id } });
    if (existeMatricula) {
      throw new BusinessException('Não é possível excluir. Curso possui aluno(s) matriculado(s).');
    }

    await CursoRepository.excluir({ id });

    return new Mensagem('Aula excluido com sucesso!', {
      id,
    });
  }
}
