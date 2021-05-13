import jwt from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import AlunoController from '../controllers/aluno.controller';
import Aluno from '../entities/aluno.entity';
import config from '../utils/config/config';
import Mensagem from '../utils/mensagem';
import BusinessException from '../utils/exceptions/business.exception';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.post('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new AlunoController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    const mensagem: Mensagem = await new AlunoController().alterar(Number(id), req.body, decoded);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    if (decoded.tipo !== TipoUsuario.PROFESSOR) {
      throw new BusinessException('Somente um professor pode excluir um aluno.');
    }
    const mensagem: Mensagem = await new AlunoController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const aluno: Aluno = await new AlunoController().obterPorId(Number(id));
    res.json(aluno);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alunos: Aluno[] = await new AlunoController().listar();
    res.json(alunos);
  } catch (e) {
    next(e);
  }
});

export default router;
