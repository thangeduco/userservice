import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interfaces/routes/auth.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});