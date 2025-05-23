import { pool } from '../db';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/models/user.model';

export class PgAuthRepository implements AuthRepository {
    async findUserByEmailOrPhone(identifier: string): Promise<User | null> {
        const res = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR phone = $1 LIMIT 1',
            [identifier]
        );
        const row = res.rows[0];
        if (!row) return null;
        return {
            id: row.id.toString(),
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash, // ✅ fix ở đây
            status: row.status,
            role: row.role,
            createdAt: row.created_at.toISOString()
        };

    }

    async createUser(user: Partial<User>): Promise<User> {
        const res = await pool.query(
            `INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
            [user.fullName, user.email || null, user.phone || null, user.passwordHash, 'user', 'active']
        );
        return res.rows[0];
    }

    async createSession(userId: string, token: string, device: string, expiredAt: string): Promise<void> {
        await pool.query(
            `INSERT INTO sessions (user_id, token, device, expired_at)
       VALUES ($1, $2, $3, $4)`,
            [userId, token, device, expiredAt]
        );
    }
}