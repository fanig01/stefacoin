import jwt from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import CursoController from '../controllers/curso.controller';
import Curso from '../entities/curso.entity';
import config from '../utils/config/config';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.post('/curso', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    if (decoded.tipo !== TipoUsuario.PROFESSOR) {
      throw new BusinessException('Somente um professor pode incluir um curso.');
    }
    const mensagem: Mensagem = await new CursoController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, config.auth.secret);
    if (decoded.tipo !== TipoUsuario.PROFESSOR) {
      throw new BusinessException('Somente um professor pode alterar um curso.');
    }
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().alterar(Number(id), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const curso: Curso = await new CursoController().obterPorId(Number(id));
    res.json(curso);
  } catch (e) {
    next(e);
  }
});

router.get('/curso', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursos: Curso[] = await new CursoController().listar();
    res.json(cursos);
  } catch (e) {
    next(e);
  }
});

export default router;
