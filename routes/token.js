import express from 'express';
import tokenModel from './../models/token.js';

const router = express.Router();

router.post('/update', (req, res) => {
    const tokenObj = req.body;
    tokenModel.get(tokenObj.userId)
        .then(dbToken => {
            if (dbToken) {
                dbToken.access_token = tokenObj.access_token;
                dbToken.token_type = tokenObj.token_type;
                dbToken.expire_at = tokenObj.expire_at;
                dbToken.refresh_token = tokenObj.refresh_token;
                dbToken.scope = tokenObj.scope;
                dbToken.save();
            }
            else {
                new tokenModel({
                    userId: tokenObj.userId,
                    access_token: tokenObj.access_token,
                    token_type: tokenObj.token_type,
                    expire_at: (Date.now() / 1000) + tokenObj.expires_in,
                    refresh_token: tokenObj.refresh_token,
                    scope: tokenObj.scope,
                })
                    .save();
            }
            res.send(true);
        })
        .catch(e => {
            console.log('Token update error API : ', e.message);
            res.send(false);
        });
});

router.post('/get', (req, res) => {
    const userId = req.body.userId;
    tokenModel.get(userId)
        .then(dbToken => {
            if (dbToken) {
                res.send(dbToken);
            }
            else {
                res.send(false);
            }
        })
        .catch(e => {
            console.log('Token get error API : ', e.message);
            res.send(false);
        });
});

router.post('/remove', (req, res) => {
    const userId = req.body.userId;
    tokenModel.deleteOne({ userId: userId }, err => {
        if (err) return res.send(false);
        res.send(true);
    })
});

export default router;