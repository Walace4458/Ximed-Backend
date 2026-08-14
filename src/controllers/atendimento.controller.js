import { prisma } from '../config/prisma.js';

const VALID_STATUSES = ['RECEPCAO', 'ENFERMAGEM', 'MEDICO', 'LIBERACAO', 'CANCELADO'];

// 1. Entrar na Fila (Criar Atendimento)
export const createAtendimento = async (req, res) => {
    try {
        const { personId, priority } = req.body;

        if (!personId) {
            return res.status(400).json({ error: "O id da pessoa (personId) é obrigatório." });
        }

        // verifica se a pessoa informada existe no banco
        const person = await prisma.person.findUnique({
            where: { id: personId },
        });

        if (!person) {
            return res.status(404).json({ error: 'Pessoa não encontrada para iniciar atendimento' });
        }

        // Cria o atendimento com status inicial padrão 'RECEPCAO' e agora prioridade
        const atendimento = await prisma.atendimento.create({
            data: {
                personId,
                status: 'RECEPCAO',
                priority: priority || 'NORMAL',
            },
            include: {
                person: true, // traz os dados da pessoa na resposta
            },
        });

        return res.status(201).json(atendimento);
    } catch (error) {
        console.error('Erro ao criar atendimento:', error);
        return res.status(500).json({ error: 'Erro interno ao colocar pessoa na fila.' });
    }
};

// 2. Listar Atendimentos (Fila de Espera)
export const listAtendimentos = async (req, res) => {
    try {
        const { status, activeOnly } = req.query;

        const where = {};

        // Permite filtragem por status (ex: ?status=ENFERMAGEM)
        if (status && VALID_STATUSES.includes(status)) {
            where.status = status;
        } else if (activeOnly === 'true') {
            // Se passar para ?acitveOnly=true, traz só quem ainda está em atendimento
            where.status = {
                notIn: ['LIBERACAO', 'CANCELADO'],
            };
        }

        const atendimentos = await prisma.atendimento.findMany({
            where,
            include: {
                person: true,
            },
            orderBy: {
                createdAt: 'asc', // Ordenado por ordem de chegada (mais antigo primeiro)
            },
        });

        return res.json(atendimentos);
    } catch (error) {
        console.error('Erro ao listar antedimentos:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar a fila.' });
    }
};

// 3. Buscar Atendimento por ID
export const getAtendimentoById = async (req, res) => {
    try {
        const { id } = req.params;

        const atendimento = await prisma.atendimento.findUnique({
            where: { id },
            include: { person: true },
        });

        if (!atendimento) {
            return res.status(404).json({ error: 'Atendimento não encontrado.' });
        }

        return res.json(atendimento);
    } catch (error) {
        console.error('Erro ao buscar atendimento:', error);
        return res.status(500).json({ error: 'Erro ao buscar atendimento.' });
    }
};

// 4. Aletrar Etapa / Status do Atendimento / Prioridade também agora / Agora pode adicionar notas
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, notes } = req.body;

        // Validação do status
        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                error: `Status invalido. Use um dos seguintes: ${VALID_STATUSES.join(', ')}`,
            });
        }

        const atendimento = await prisma.atendimento.findUnique({
            where: { id },
        });

        if (!atendimento) {
            return res.status(404).json({ error: 'Atendimento não encontrado.' });
        }

        const dataToUpdate = {};
        if (status) dataToUpdate.status = status;
        if (priority) dataToUpdate.priority = priority; // Acho que agora vai a prioridade com isso (foi)
        if (notes !== undefined) dataToUpdate.notes = notes; // Isso faz a notes funcionarem hehe

        const updatedAtendimento = await prisma.atendimento.update({
            where: { id },
            data: dataToUpdate,
            include: { person: true },
        });

        return res.json(updatedAtendimento);
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return res.status(500).json({ error: 'Erro ao avançar etapa do atendimento.' });
    }
};

// 5. Remover da fila (exclusão)
export const deleteAtendimento = async (req, res) => {
    try {
        const { id } = req.params;

        const atendimento = await prisma.atendimento.findUnique({ where: { id } });
        if (!atendimento) {
            return res.status(404).json({ error: 'Atendimento não encontrado.' });
        }

        await prisma.atendimento.delete({
            where: { id },
        });

        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover atendimento:', error);
        return res.status(500).json({ error: 'Erro ao remover atendimento.' });
    }
};