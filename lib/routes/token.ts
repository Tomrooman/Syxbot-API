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

router.post('/connect',
    tokenMiddleware.setConnectDataToCallDiscordAPI,
    tokenMiddleware.getTokenDiscordAPI,
    (_req, res) => {
        res.send(res.token || false);
    });

router.post('/update',
    tokenMiddleware.createOrUpdateToken,
    (_req, res) => {
        res.send(res.token || false);
    });

router.post('/remove',
    tokenMiddleware.removeToken,
    (_req, res) => {
        res.send(res.token || false);
    });

export default router;
