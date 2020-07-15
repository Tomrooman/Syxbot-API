import express from 'express';
import tokenMiddleware from './middleware/token.js';
import tokenModel from './../models/token.js';

const router = express.Router();

router.post('/update',
    tokenMiddleware.createOrUpdateToken,
    (req, res) => {
        res.send(res.token || false);
    });

router.post('/get', (req, res) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        tokenModel.get(userId)
            .then(dbToken => {
                if (dbToken) return res.send(dbToken);
                res.send(false);
            }).catch(e => {
                console.log('Token get error API : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/remove', (req, res) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        tokenModel.deleteOne({ userId: userId }, err => {
            if (err) return res.send(false);
            res.send(true);
        });
    }
    else {
        res.send(false);
    }
});

export default router;