import express from 'express';
import * as settingsMiddleware from './../middleware/settings';

const router = express.Router();

router.get('/',
    settingsMiddleware.getAllSettings,
    (req, res) => {
        res.send(res.settings || false);
    });

router.post('/update',
    settingsMiddleware.createOrUpdateSettings,
    (req, res) => {
        res.send(res.settings || false);
    });

export default router;
