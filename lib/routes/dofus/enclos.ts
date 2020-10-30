'use strict';

import express from 'express';
import * as enclosMiddleware from './../../middleware/dofus/enclos';

const router = express.Router();

router.post('/',
    enclosMiddleware.getEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

router.post('/modify',
    enclosMiddleware.modifyEnclos,
    (_req, res) => {
        res.send(res.enclos || false);
    });

export default router;
