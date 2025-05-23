import { Router } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { PgAuthRepository } from '../../infrastructure/repositories/pg-auth.repository';
import { AuthController } from '../controllers/auth.controller';

const repo = new PgAuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

const router = Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
export default router;
