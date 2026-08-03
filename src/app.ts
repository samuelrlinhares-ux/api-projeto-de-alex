import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';

// Importa as rotas
import authRoutes from './routes/auth';
import clienteRoutes from './routes/clientes';
import veiculoRoutes from './routes/veiculos';
import ordemRoutes from './routes/ordens';
import indexRoutes from './routes/index';

// Importa o middleware de tratamento de erros
import { errorHandler } from './middlewares/errorHandler';

dotenv.config(); // Carrega variáveis de ambiente do .env

const app = express();

// Configurações do View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globais
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário
app.use(express.static(path.join(__dirname, '../public'))); // Serve arquivos estáticos da pasta public

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Rotas da aplicação
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/ordens', ordemRoutes);
app.use('/', indexRoutes); // Rota principal

// Middleware de tratamento de erros (DEVE ser o último middleware)
app.use(errorHandler);

export default app;