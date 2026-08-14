import { Router } from 'express';
import {
    createAtendimento,
    listAtendimentos,
    getAtendimentoById,
    updateStatus,
    deleteAtendimento,
} from '../controllers/atendimento.controller.js';

const router = Router();

router.post('/', createAtendimento);
router.get('/', listAtendimentos);
router.get('/:id', getAtendimentoById);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteAtendimento);

export default router;