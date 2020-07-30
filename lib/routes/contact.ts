'use strict';

import express from 'express';
import * as contactMiddleware from './../middleware/contact';

const router = express.Router();

router.post('/contact',
    contactMiddleware.sendMail,
    (_req, res) => {
        res.send(res.mail || false);
    });

export default router;
