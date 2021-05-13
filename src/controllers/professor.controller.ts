import Professor from '../entities/professor.entity';
import CursoRepository from '../repositories/curso.repository';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = { tipo: { $eq: TipoUsuario.PROFESSOR } }): Promise<Professor[]> {
    let professores = await ProfessorRepository.listar(filtro);
    professores = await Promise.all(professores.map(async (professor) => {
      const cursos = await CursoRepository.listar({ idProfessor: { $eq: professor.id }});
      return <Professor>{
        ...professor,
        cursos: cursos
      }
    }))
    return await professores;
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;
    const existeProfessor = await ProfessorRepository.obter({ email: { $eq: email } });
    if (existeProfessor) {
      throw new BusinessException('Email já cadastrado');
    }

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor, uid: any) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ id }, { nome }, { email }, { senha }]);

    const existeProfessor = await ProfessorRepository.obter({ id: { $eq: id } });
    if (!existeProfessor || existeProfessor.email !== uid.email) {
      throw new BusinessException('Professor não existe ou não é permitido alterar os dados de outro professor.');
    }
    if (existeProfessor.email !== email) {
      throw new BusinessException('Não é permitido alterar email.');
    }

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
