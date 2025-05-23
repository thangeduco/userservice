import { Request, Response } from 'express';
import { AuthService } from '../../application/services/auth.service';

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password } = req.body;
      const result = await this.service.register({ fullName, email, phone, password });
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await this.service.login(emailOrPhone, password);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  };
}