export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  status: string;
  role: string;
  createdAt: string;
}