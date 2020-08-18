'use strict';

import express from 'express';
import * as enclosMiddleware from './../../middleware/dofus/enclos';

const router = express.Router();

router.post('/',
    enclosMiddleware.getEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

router.post('/create',
    enclosMiddleware.createOrAddEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

router.post('/update',
    enclosMiddleware.updateEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

router.post('/remove',
    enclosMiddleware.removeEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

export default router;
