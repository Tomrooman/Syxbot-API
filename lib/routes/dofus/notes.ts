'use strict';

import express from 'express';
import * as notesMiddleware from './../../middleware/dofus/notes';

const router = express.Router();

router.post('/',
    notesMiddleware.getNotes,
    (_req, res) => {
        res.send(res.notes || false);
    });

router.post('/create',
    notesMiddleware.createOrAddNotes,
    (_req, res) => {
        res.send(res.notes || false);
    });

router.post('/update',
    notesMiddleware.updateNotes,
    (_req, res) => {
        res.send(res.notes || false);
    });

router.post('/remove',
    notesMiddleware.removeNotes,
    (_req, res) => {
        res.send(res.notes || false);
    });

export default router;
