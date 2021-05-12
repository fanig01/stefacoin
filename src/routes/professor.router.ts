import jwt from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import Mensagem from '../utils/mensagem';
import config from '../utils/config/config';
import BusinessException from '../utils/exceptions/business.exception';

const router = express.Router();

router.post('/professor', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new ProfessorController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    const mensagem: Mensagem = await new ProfessorController().alterar(Number(id), req.body, decoded);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    if (decoded.tipo !== 1) {
      throw new BusinessException('Somente um professor pode excluir outro professor.');
    }
    const mensagem: Mensagem = await new ProfessorController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const professor: Professor = await new ProfessorController().obterPorId(Number(id));
    res.json(professor);
  } catch (e) {
    next(e);
  }
});

router.get('/professor', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const professores: Professor[] = await new ProfessorController().listar();
    res.json(professores);
  } catch (e) {
    next(e);
  }
});

export default router;
