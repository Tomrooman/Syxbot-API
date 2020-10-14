'use strict';

import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import config from '../../config.json';
import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { getDiscordConnection } from '../../index';

export const websiteAuthVerif = async (req: Request, res: Response, next: NextFunction): Promise<ServerResponse | void> => {
    if (req.body.token === config.security.token) {
        if (req.body.type === 'site') {
            const syxbotInfos = req.universalCookies.get('syxbot_infos');
            const syxbot = req.universalCookies.get('syxbot');
            if (syxbot && syxbotInfos) {
                const userId = verifyJsonToken(syxbotInfos.jwt);
                if (userId) {
                    req.body.userId = userId;
                    return next();
                }
                return res.status(401).json('Invalid token');
            }
            return next();
        }
        if (req.body.type === 'bot') return next();
    }
    return res.status(401).json('Invalid token');
};

const verifyJsonToken = (signature: string): boolean | string => {
    try {
        const verify = jwt.verify(signature, config.security.secret);
        const compare = bcrypt.compare(config.security.secret, verify.secret);
        if (compare) {
            return verify.userId;
        }
        return false;
    }
    catch (e) {
        console.log('verify json token website failed : ', e.message);
        return false;
    }
};

export const discordBotAuthVerif = (req: Request, res: Response, next: NextFunction): void | ServerResponse => {
    if (req.body.token === config.security.token) {
        if (req.body.type === 'bot') {
            if (!req.body.jwt && req.url === '/bot/auth' && !getDiscordConnection()) {
                return next();
            }
            if (req.body.jwt) {
                try {
                    jwt.verify(req.body.jwt, config.security.secret);
                    return next();
                }
                catch (e) {
                    console.log('Error while verifyng jwt token : ', e.message);
                    return res.status(401).json('Invalid token');
                }
            }
            return res.status(401).json('Invalid token');
        }
        if (req.body.type === 'site') return next();
    }
    return res.status(401).json('Invalid token');
};