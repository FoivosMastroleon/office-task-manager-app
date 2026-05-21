import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
import taskRoutes from './routes/task.routes';
import { setupSwagger } from './swagger';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:4200']  // Angular dev server
}));

setupSwagger(app);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

export default app;