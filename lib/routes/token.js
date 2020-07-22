import express from 'express';
import * as tokenMiddleware from './../middleware/token';

const router = express.Router();

router.post('/expiration',
    tokenMiddleware.getToken,
    tokenMiddleware.setUpdateDataToCallDiscordAPI,
    tokenMiddleware.getTokenDiscordAPI,
    (req, res) => {
        res.send(res.token || false);
    });

router.post('/connect',
    tokenMiddleware.setConnectDataToCallDiscordAPI,
    tokenMiddleware.getTokenDiscordAPI,
    (req, res) => {
        res.send(res.token || false);
    });

router.post('/update',
    tokenMiddleware.createOrUpdateToken,
    (req, res) => {
        res.send(res.token || false);
    });

router.post('/remove',
    tokenMiddleware.removeToken,
    (req, res) => {
        res.send(res.token || false);
    });

export default router;
