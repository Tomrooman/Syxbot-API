'use strict';

import settingsModel from '../models/settings';
import { settingsType } from '../@types/models/settings';

export const getAllSettings = async (req, res, next) => {
    const settings = await settingsModel.getAllSettings();
    if (settings) {
        res.settings = settings;
    }
    next();
};

export const createOrUpdateSettings = async (req, res, next) => {
    if (req.body.guildId) {
        let settings: settingsType | false = false;
        const allSettings = await settingsModel.get(req.body.guildId);
        if (allSettings) {
            settings = await settingsModel.updateSettings(allSettings, req.body.notif, req.body.audio);
        }
        else {
            settings = await settingsModel.createSettings(req.body.guildId, req.body.notif, req.body.audio);
        }
        if (settings) {
            res.settings = true;
        }
    }
    next();
};
