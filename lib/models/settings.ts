import mongoose from 'mongoose';
import dateFormat from 'dateformat';
import { settingsType, userStatic, audioType, notifType } from '../@types/models/settings';

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    notif: {
        current: {
            type: String,
            required: true
        },
        added: {
            type: String,
            required: true
        },
        removed: {
            type: String,
            required: true
        },
        radio: {
            type: String,
            required: true
        }
    },
    audio: {
        volume: {
            type: Number,
            required: true
        }
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

settingsSchema.statics.getAllSettings = async (): Promise<settingsType[]> => {
    const Settings = mongoose.model<settingsType>('Settings');
    const settings = await Settings.find().lean();
    return settings as settingsType[];
};

settingsSchema.statics.get = async (guildId: string): Promise<settingsType | false> => {
    if (guildId) {
        const Settings = mongoose.model<settingsType>('Settings');
        const settings = await Settings.findOne({
            guildId: guildId
        }).lean();
        if (settings) return settings as settingsType;
    }
    return false;
};

settingsSchema.statics.createSettings = async (guildId: string, notif: notifType, audio: audioType): Promise<settingsType | false> => {
    if (guildId && (notif && Object.keys(notif).length) && (audio && Object.keys(audio).length)) {
        const settingsObj = {
            guildId: guildId,
            notif: notif,
            audio: audio
        };
        const Settings = mongoose.model<settingsType>('Settings');
        const settingsSaved = await new Settings(settingsObj).save();
        return settingsSaved.toObject();
    }
    return false;
};

settingsSchema.statics.updateSettings = async (settings: settingsType, notif: notifType, audio: audioType): Promise<settingsType | false> => {
    if ((settings && Object.keys(settings).length) &&
        (notif && Object.keys(notif).length) &&
        (audio && Object.keys(audio).length)) {
        settings.notif = notif;
        settings.audio = audio;
        // allSettings.twitter = req.body.twitter;
        settings = mongoose.model<settingsType>('Settings').hydrate(settings);
        settings.markModified('notif');
        settings.markModified('audio');
        await settings.save();
        return settings.toObject();
    }
    return false;
};

export default mongoose.model<settingsType, userStatic>('Settings', settingsSchema);
