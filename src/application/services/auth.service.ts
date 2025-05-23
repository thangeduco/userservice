import { AuthRepository } from '../../domain/repositories/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async register(input: { fullName: string; email?: string; phone?: string; password: string }) {
    const existing = await this.repo.findUserByEmailOrPhone(input.email || input.phone!);
    if (existing) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.repo.createUser({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    await this.repo.createSession(user.id, token, 'web', new Date(Date.now() + 7 * 86400000).toISOString());

    return { user, token };
  }

  async login(identifier: string, password: string) {
    const user = await this.repo.findUserByEmailOrPhone(identifier);
    if (!user) throw new Error('User not found');

    console.log('>> Password input:', password);
    console.log('>> Password hash from DB:', user.passwordHash);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    await this.repo.createSession(user.id, token, 'web', new Date(Date.now() + 7 * 86400000).toISOString());

    return { user, token };
  }
}