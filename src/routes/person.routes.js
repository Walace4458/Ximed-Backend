import { Router } from 'express';
import {
    createPerson,
    listPersons,
    getPersonById,
    updatePerson,
    deletePerson,
} from '../controllers/person.controller.js';

const router = Router();

router.post('/', createPerson);
router.get('/', listPersons);
router.get('/:id', getPersonById);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;