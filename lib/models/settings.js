import mongoose from 'mongoose';
import dateFormat from 'dateformat';

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
    this.updatedAt.iso = Date.now();
    this.updatedAt.formatted = dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss');
    next();
});

settingsSchema.statics.getAllSettings = async () => {
    const Settings = mongoose.model('Settings', settingsSchema);
    const settings = await Settings.find();
    if (settings) {
        return settings;
    }
    return false;
};

settingsSchema.statics.get = async guildId => {
    if (guildId) {
        const Settings = mongoose.model('Settings', settingsSchema);
        const settings = await Settings.findOne({
            guildId: guildId
        });
        if (settings) {
            return settings;
        }
    }
    return false;
};

settingsSchema.statics.createSettings = async (guildId, notif, audio) => {
    if (guildId && notif && audio) {
        const settingsObj = {
            guildId: guildId,
            notif: notif,
            audio: audio
        };
        new settingsSchema(settingsObj).save();
        return settingsObj;
    }
    return false;
};

settingsSchema.statics.updateSettings = async (allSettings, notif, audio) => {
    if (allSettings && notif && audio) {
        allSettings.notif = notif;
        allSettings.audio = audio;
        // allSettings.twitter = req.body.twitter;
        allSettings.save();
        return allSettings;
    }
    return false;
};

export default mongoose.model('Settings', settingsSchema);