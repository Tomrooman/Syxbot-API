import express from 'express';
import * as notesMiddleware from './../../middleware/dofus/notes';

const router = express.Router();

router.post('/',
    notesMiddleware.getNotes,
    (req, res) => {
        res.send(res.notes || false);
    });

router.post('/create',
    notesMiddleware.createOrAddNotes,
    (req, res) => {
        res.send(res.notes || false);
    });

router.post('/update',
    notesMiddleware.updateNotes,
    (req, res) => {
        res.send(res.notes || false);
    });

router.post('/remove',
    notesMiddleware.removeNotes,
    (req, res) => {
        res.send(res.notes || false);
    });

export default router;
