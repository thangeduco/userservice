import { User } from '../models/user.model';

export interface AuthRepository {
  findUserByEmailOrPhone(identifier: string): Promise<User | null>;
  createUser(user: Partial<User>): Promise<User>;
  createSession(userId: string, token: string, device: string, expiredAt: string): Promise<void>;
}
