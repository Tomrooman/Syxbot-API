import { Document, Model } from 'mongoose';

export interface settingsType extends Document {
    guildId: string;
    notif: notifType;
    audio: audioType;
    createdAt?: {
        iso: Date;
        formatted: string;
    };
    updatedAt?: {
        iso: Date;
        formatted: string;
    };
}

interface notifType {
    current: string;
    added: string;
    removed: string;
    radio: string;
}

interface audioType {
    volume: number;
}

export interface userStatic extends Model<settingsType> {
    get(guildId: string): Promise<settingsType> | false;

    getAllSettings(): Promise<settingsType[]> | false;

    createSettings(guildId: string, notif: notifType, audio: audioType): Promise<settingsType> | false;

    updateSettings(allSettings: settingsType, notif: notifType, audio: audioType): Promise<settingsType> | false;
}