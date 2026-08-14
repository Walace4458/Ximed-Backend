import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personRoutes from './routes/person.routes.js';
import atendimentoRoutes from './routes/atendimento.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/persons', personRoutes);
app.use('/atendimentos', atendimentoRoutes);

// Rota de Healthcheck
app.get('/health', (req, res) => {
    return res.json({
        status: 'ok', message: 'API XIMED rodando com sucesso'
    });
});

app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
});