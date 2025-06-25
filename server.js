/**
 * Arquivo principal do servidor.
 * Define middlewares, rotas e inicializa o servidor Express.
 * 
 * @module server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './models/database.js';
import authRoute from './routes/auth.js';
import pedidoRoute from './routes/pedido.js';

dotenv.config();

const app = express();

/**
 * Porta do servidor, definida no .env ou padrão 9999.
 * @type {number|string}
 */
const PORT = process.env.PORT || 9999;

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://menuzio.netlify.app']
}));

// Middleware para JSON
app.use(express.json());

// Rotas principais
app.use('/auth', authRoute);
app.use('/pedidos', pedidoRoute);

/**
 * Rota raiz apenas para verificação.
 * @name GET/
 * @function
 * @memberof module:server
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
app.get('/', (req, res) => {
  res.send('O back está funcionando!');
});

// Conecta ao MongoDB
connectDatabase();

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
