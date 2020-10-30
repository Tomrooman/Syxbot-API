'use strict';

import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import config from '../../config.json';
import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { getDiscordConnection } from '../../index';

export const websiteAuthVerif = async (req: Request, res: Response, next: NextFunction): Promise<ServerResponse | void> => {
    if (req.body.type === 'site') {
        if (req.body.token === config.security.token) {
            req.body.userID = undefined;
            const syxbotInfos = req.universalCookies.get('syxbot_infos');
            const syxbot = req.universalCookies.get('syxbot');
            if (syxbot && syxbotInfos) {
                const userID = verifyJsonToken(syxbotInfos.jwt);
                if (userID) {
                    req.body.userID = userID;
                    return next();
                }
                return res.status(401).json('Invalid data');
            }
            else return res.status(401).json('Invalid data');
        }
        return res.status(401).json('Invalid data');
    }
    else return next();
};

const verifyJsonToken = (signature: string): boolean | string | undefined => {
    try {
        const verify = jwt.verify(signature, config.security.secret);
        bcrypt.compare(config.security.secret, verify.secret);
        return verify.userID;
    }
    catch (e) {
        return false;
    }
};

export const discordBotAuthVerif = (req: Request, res: Response, next: NextFunction): void | ServerResponse => {
    if (req.body.type === 'bot') {
        if (req.body.token === config.security.token) {
            if (!req.body.jwt && req.url === '/bot/auth' && !getDiscordConnection()) return next();
            if (req.body.jwt) {
                try {
                    jwt.verify(req.body.jwt, config.security.secret);
                    return next();
                }
                catch (e) {
                    return res.status(401).json('Invalid data');
                }
            }
        }
        return res.status(401).json('Invalid data');
    }
    else if (req.body.type === 'site') return next();
    else return res.status(400).json('Invalid data');
};