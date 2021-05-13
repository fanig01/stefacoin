import AlunoCurso from '../entities/aluno-curso.entity'
import { Tables } from '../utils/tables.enum';
import Repository from './repository';

class AlunoCursoRepository extends Repository<AlunoCurso> {
  constructor() {
    super(Tables.ALUNOCURSO);
  }

  async incluir(alunoCurso: AlunoCurso) {

    return super.incluir(alunoCurso);
  }
}


export default new AlunoCursoRepository();