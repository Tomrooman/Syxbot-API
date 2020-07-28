'use strict';

import express from 'express';
import * as settingsMiddleware from './../middleware/settings';

const router = express.Router();

router.post('/',
    settingsMiddleware.getAllSettings,
    (_req, res) => {
        res.send(res.settings || false);
    });

router.post('/update',
    settingsMiddleware.createOrUpdateSettings,
    (_req, res) => {
        res.send(res.settings || false);
    });

export default router;
