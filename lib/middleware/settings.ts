'use strict';

import settingsModel from '../models/settings';
import { settingsType } from '../@types/models/settings';
import { Request, Response, NextFunction } from 'express';

export const getAllSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const settings = await settingsModel.getAllSettings();
    if (settings) {
        res.settings = settings;
        res.status(200);
    }
    next();
};

export const createOrUpdateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.guildId) {
        let settings: settingsType | false = false;
        const oldSettings = await settingsModel.get(req.body.guildId);
        if (oldSettings) {
            settings = await settingsModel.updateSettings(oldSettings, req.body.notif, req.body.audio);
            res.status(200);
        }
        else {
            settings = await settingsModel.createSettings(req.body.guildId, req.body.notif, req.body.audio);
            res.status(201);
        }
        if (settings) res.settings = settings;
        else res.status(400);
    }
    else res.status(400);
    next();
};
