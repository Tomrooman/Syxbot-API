import express from 'express';
import settingsMiddleware from './middleware/settings.js';

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