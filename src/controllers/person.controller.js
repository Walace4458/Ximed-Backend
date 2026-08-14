import { prisma } from '../config/prisma.js';

// Criar nova pessoa
export const createPerson = async (req, res) => {
    try {
        const { name, cpf, phone } = req.body;

        if (!name || !cpf) {
            return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' });
        }

        // Verifica se já existe pessoa com este CPF
        const existingPerson = await prisma.person.findUnique({
            where: { cpf },
        });

        if (existingPerson) {
            return res.status(400).json({ error: 'Já existe uma pessoa cadastrada com este CPF.' });
        }

        const person = await prisma.person.create({
            data: { name, cpf, phone },
        });

        return res.status(201).json(person);
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        return res.status(500).json({ error: 'Erro interno ao cadastrar pessoa.' });
    }
};

// Listar todas as epssoas

export const listPersons = async (req, res) => {
    try {
        const persons = await prisma.person.findMany({
            orderBy: { name: 'asc' },
        });
        return res.json(persons);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar pessoas.' });
    }
};

// Buscar pessoa por ID (com seu histórico de atendimentos)
export const getPersonById = async (req, res) => {
    try {
        const { id } = req.params;

        const person = await prisma.person.findUnique({
            where: { id },
            include: { atendimento: true }, // Traz o histórico de atendimentos!
        });

        if (!person) {
            return res.status(404).json({ error: 'Pessoa não encontrada.' });
        }

        return res.json(person);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar dados da pessoa.' });
    }
};

// Atualizar pessoa
export const updatePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        const person = await prisma.person.findUnique({ where: { id } });
        if (!person) {
            return res.status(404).json({ error: 'Pessoa não encontrada.' });
        }

        const updatedPerson = await prisma.person.update({
            where: { id },
            data: { name, phone },
        });

        return res.json(updatedPerson);
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        return res.status(500).json({ error: 'Erro ao atualizar pessoa.' });
    }
};

// Remover pessoa
export const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;

        const person = await prisma.person.findUnique({ where: { id } });
        if (!person) {
            return res.status(404).json({ error: 'Pessoa não encontrada.' });
        }

        await prisma.person.delete({
            where: { id },
        });

        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover pessoa:', error);
        return res.status(500).json({ error: 'Erro ao remover pessoa.' });
    }
};