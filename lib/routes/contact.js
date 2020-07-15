import express from 'express';
import contactMiddleware from './middleware/contact.js';

const router = express.Router();

router.post('/contact',
    contactMiddleware.sendMail,
    (req, res) => {
        res.send(res.mailStatus || false);
    });

export default router;