import express, { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import ProfessorController from '../controllers/professor.controller';
import Login from '../models/login.model';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';

const router = express.Router();

/**
 * Login temporário até a conclusão do oidc
 */
router.post('/auth', async (req, res, next) => {
  try {
    const login: Login = await new AuthController().login(req.body);
    res.json(login);
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try { 
    let mensagem: Mensagem = <Mensagem>{};
    switch (req.body.tipo) {
      case 1:
        mensagem = await new ProfessorController().incluir(req.body);
        break;
    
      default:
        throw new BusinessException('Tipo usuário não identificado');
    }
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

export default router;
