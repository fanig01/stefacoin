import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = { tipo: { $eq: TipoUsuario.ALUNO } }): Promise<Aluno[]> {
    return await AlunoRepository.listar(filtro);
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;

    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
    
    const existeAluno = await AlunoRepository.obter({ email: { $eq: email } });
    if (existeAluno) {
      throw new BusinessException('Email já cadastrado');
    }
    const id = await AlunoRepository.incluir(aluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, aluno: Aluno, uid: any) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ id }, { nome }, { formacao }, { idade }, { email }, { senha }]);
    const existeAluno = await AlunoRepository.obter({ id: { $eq: id } });
    if (!existeAluno || (existeAluno.email !== uid.email && uid.tipo === 2)) {
      throw new BusinessException('Aluno não existe ou não é permitido alterar os dados de outro aluno.');
    }
    if (existeAluno.email !== email) {
      throw new BusinessException('Não é permitido alterar email.');
    }

    await AlunoRepository.alterar({ id }, aluno);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);
    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
