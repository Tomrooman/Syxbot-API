'use strict';

import tokenModel from './../../models/token.js';

const createOrUpdateToken = async (req, res, next) => {
    const userId = req.body.userId;
    const access_token = req.body.access_token;
    const refresh_token = req.body.refresh_token;
    const scope = req.body.scope;
    const token_type = req.body.token_type;
    if (userId && access_token && refresh_token && scope && token_type) {
        let token = false;
        const tokenObj = {
            userId: userId,
            access_token: access_token,
            refresh_token: refresh_token,
            scope: scope,
            token_type: token_type
        };
        const tokenInfos = await tokenModel.get(req.body.userId);
        if (tokenInfos) {
            token = await tokenModel.updateToken(tokenInfos, tokenObj, req.body.expire_at);
        }
        else {
            token = await tokenModel.createToken(tokenObj, req.body.expires_in);
        }
        if (token) {
            res.token = true;
        }
    }
    next();
};

exports.createOrUpdateToken = createOrUpdateToken;