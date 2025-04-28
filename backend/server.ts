import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
dotenv.config();

const app: Application = express();

// Middleware CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Conexão com Database
connectDB();

// Middleware JSON
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/tarefas", taskRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado na porta ${PORT}`);
});
