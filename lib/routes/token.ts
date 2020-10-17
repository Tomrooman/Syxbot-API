'use strict';

import express from 'express';
import * as tokenMiddleware from './../middleware/token';

const router = express.Router();

router.post('/expiration',
    tokenMiddleware.getToken,
    tokenMiddleware.setUpdateDataToCallDiscordAPI,
    tokenMiddleware.getTokenDiscordAPI,
    (_req, res) => {
        res.send(res.token || false);
    });

router.post('/createCookie',
    tokenMiddleware.setConnectDataToCallDiscordAPI,
    tokenMiddleware.getTokenDiscordAPI,
    (_req, res) => {
        res.send(res.token || false);
    });

router.put('/update',
    tokenMiddleware.createOrUpdateToken,
    (_req, res) => {
        res.send(res.token || false);
    });

router.delete('/remove',
    tokenMiddleware.removeToken,
    (_req, res) => {
        res.send(res.token || false);
    });

export default router;
