import express from 'express';
import settingsModel from './../models/settings.js';

const router = express.Router();

router.get('/', (req, res) => {
    settingsModel.find()
        .then(settings => {
            res.send(settings);
        })
        .catch(e => {
            console.log('Error in API route to get all settings : ', e.message);
            res.send(false);
        });
});

router.post('/update', (req, res) => {
    const settingsObj = req.body;
    settingsModel.get(settingsObj.guildId)
        .then(dbSettings => {
            if (dbSettings) {
                dbSettings.notif = settingsObj.notif;
                dbSettings.audio = settingsObj.audio;
                dbSettings.twitter = settingsObj.twitter;
                dbSettings.save();
            }
            else {
                new settingsModel(settingsObj).save();
            }
            res.send(true);
        })
        .catch(e => {
            console.log('error while get one settings : ', e.message);
            res.send(false);
        });
});

export default router;