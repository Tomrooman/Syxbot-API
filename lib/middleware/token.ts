'use strict';

import tokenModel from '../models/token';
import Config from '../../config.json';
import queryString from 'querystring';
import Axios from 'axios';
import { tokenType } from 'lib/@types/models/token';
import bcrypt from 'bcrypt';

export const getToken = async (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const token = await tokenModel.get(userId);
        if (token) {
            res.token = token;
        }
    }
    next();
};

export const createOrUpdateToken = async (req, res, next) => {
    const userId = req.body.userId;
    const access_token = req.body.access_token;
    const refresh_token = req.body.refresh_token;
    const scope = req.body.scope;
    const token_type = req.body.token_type;
    if (userId && access_token && refresh_token && scope && token_type) {
        let token: tokenType | false = false;
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

export const removeToken = async (req, res, next) => {
    if (req.body.userId) {
        const userId = req.body.userId;
        const token = await tokenModel.deleteToken(userId);
        if (token) {
            res.clearCookie('syxbot');
            res.clearCookie('syxbot_infos');
            res.token = true;
        }
    }
    next();
};

export const setConnectDataToCallDiscordAPI = (req, res, next) => {
    if (req.body.code) {
        const data = queryString.stringify({
            'client_id': Config.clientId,
            'client_secret': Config.secret,
            'grant_type': 'authorization_code',
            'redirect_uri': decodeURIComponent(Config.OAuth.redirect_url),
            'scope': Config.OAuth.scope,
            'code': req.body.code
        });
        res.discordData = data;
    }
    next();
};

export const setUpdateDataToCallDiscordAPI = (_req, res, next) => {
    if (res.token) {
        const data = queryString.stringify({
            'client_id': Config.clientId,
            'client_secret': Config.secret,
            'grant_type': 'refresh_token',
            'refresh_token': res.token.refresh_token,
            'redirect_uri': decodeURIComponent(Config.OAuth.redirect_url),
            'scope': Config.OAuth.scope
        });
        res.discordData = data;
    }
    next();
};

export const getTokenDiscordAPI = async (req, res, next) => {
    if (res.discordData) {
        const apiToken = await Axios.post('https://discord.com/api/oauth2/token', res.discordData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (apiToken) {
            const discordMe = await Axios.get('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${apiToken.data.token_type} ${apiToken.data.access_token}`
                }
            });
            if (discordMe) {
                await setCookies(res, discordMe, apiToken);
                res.token = {
                    ...apiToken.data,
                    expire_at: (Date.now() / 1000) + apiToken.data.expires_in
                };
            }
        }
    }
    next();
};

const setCookies = async (res, discordMe, apiToken) => {
    const hash = await bcrypt.hash(Config.bcrypt.secret, Config.bcrypt.saltRounds);
    const oneDay = 1000 * 60 * 60 * 24;
    const expireDate = new Date(Date.now() + (oneDay * 10));
    const options = {
        path: '/',
        expires: expireDate,
        secure: true,
        sameSite: true
    }
    res.cookie('syxbot_infos', {
        userId: discordMe.data.id,
        secret: hash
    }, {
        ...options,
        httpOnly: true,
    });
    res.cookie('syxbot', {
        username: discordMe.data.username,
        discriminator: discordMe.data.discriminator,
        token_type: apiToken.data.token_type,
        expire_at: (Date.now() / 1000) + apiToken.data.expires_in,
        countdown: true
    }, {
        ...options,
        httpOnly: false
    });
};
