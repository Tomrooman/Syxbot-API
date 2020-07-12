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

settingsSchema.statics.get = async guildId => {
    if (!guildId) {
        return false;
    }
    const Settings = mongoose.model('Settings', settingsSchema);
    const settings = await Settings.findOne({
        guildId: guildId
    });
    if (settings) {
        return settings;
    }
    return false;
};

export default mongoose.model('Settings', settingsSchema);