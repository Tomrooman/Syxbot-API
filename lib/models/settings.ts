import mongoose from 'mongoose';
import dateFormat from 'dateformat';
import { settingsType, userStatic, audioType, notifType } from '../@types/models/settings';

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    guildId: String,
    notif: {
        current: String,
        added: String,
        removed: String,
        radio: String
    },
    audio: {
        volume: Number
    },
    // twitter: {
    //     wolcen: {
    //         status: String,
    //         channelID: String,
    //         channelName: String
    //     },
    //     warzone: {
    //         status: String,
    //         channelID: String,
    //         channelName: String
    //     }
    // },
    createdAt: {
        iso: {
            type: Date,
            default: Date.now()
        },
        formatted: {
            type: String,
            default: dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss')
        }
    },
    updatedAt: {
        iso: {
            type: Date,
            default: Date.now()
        },
        formatted: {
            type: String,
            default: dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss')
        }
    }
}, {
    versionKey: false
});

settingsSchema.pre('save', function (next) {
    (this as any).updatedAt.iso = Date.now();
    (this as any).updatedAt.formatted = dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss');
    next();
});

settingsSchema.statics.getAllSettings = async (): Promise<settingsType[] | false> => {
    const Settings = mongoose.model<settingsType>('Settings');
    const settings = await Settings.find();
    if (settings) {
        return settings;
    }
    return false;
};

settingsSchema.statics.get = async (guildId: string): Promise<settingsType | false> => {
    if (guildId) {
        const Settings = mongoose.model<settingsType>('Settings');
        const settings = await Settings.findOne({
            guildId: guildId
        });
        if (settings) {
            return settings;
        }
    }
    return false;
};

settingsSchema.statics.createSettings = async (guildId: string, notif: notifType, audio: audioType): Promise<settingsType | false> => {
    if (guildId && notif && audio) {
        const settingsObj = {
            guildId: guildId,
            notif: notif,
            audio: audio
        };
        const Settings = mongoose.model<settingsType>('Settings');
        const settingsSaved = await new Settings(settingsObj).save();
        return settingsSaved;
    }
    return false;
};

settingsSchema.statics.updateSettings = async (allSettings: settingsType, notif: notifType, audio: audioType): Promise<settingsType | false> => {
    if (allSettings && notif && audio) {
        allSettings.notif = notif;
        allSettings.audio = audio;
        // allSettings.twitter = req.body.twitter;
        allSettings.markModified('notif');
        allSettings.markModified('audio');
        await allSettings.save();
        return allSettings;
    }
    return false;
};

export default mongoose.model<settingsType, userStatic>('Settings', settingsSchema);
