import mongoose from 'mongoose';
import settingsSchema from '../models/settings';
import chai from 'chai';

const expect = chai.expect;

describe('Settings', () => {
    const settingsObj = {
        guildId: '1234554321',
        notif: {
            current: 'on',
            added: 'off',
            removed: 'off',
            radio: 'on'
        },
        audio: {
            volume: 0.2
        }
    };

    it('Settings should be empty', async () => {
        const users = await settingsSchema.find();
        expect(users).to.be.an('array').that.is.empty;
    });

    it('Add first settings', async () => {
        await new settingsSchema(settingsObj).save();
        const settings = await settingsSchema.find();

        expect(settings).to.be.an('array').that.have.lengthOf(1);
        expect(settings[0].guildId).to.equal(settingsObj.guildId);
        expect(settings[0].notif.current).to.equal(settingsObj.notif.current);
        expect(settings[0].notif.added).to.equal(settingsObj.notif.added);
        expect(settings[0].notif.removed).to.equal(settingsObj.notif.removed);
        expect(settings[0].notif.radio).to.equal(settingsObj.notif.radio);
        expect(settings[0].audio.volume).to.equal(settingsObj.audio.volume);
    });

    it('get() Get first settings', async () => {
        const settings = await settingsSchema.get(settingsObj.guildId);
        if (settings) {
            expect(settings.guildId).to.equal(settingsObj.guildId);
            expect(settings.notif.current).to.equal(settingsObj.notif.current);
            expect(settings.notif.added).to.equal(settingsObj.notif.added);
            expect(settings.notif.removed).to.equal(settingsObj.notif.removed);
            expect(settings.notif.radio).to.equal(settingsObj.notif.radio);
            expect(settings.audio.volume).to.equal(settingsObj.audio.volume);
        }
    });

    it('Add second settings', async () => {
        settingsObj.guildId = '987656789';
        settingsObj.notif.radio = 'off';

        await new settingsSchema(settingsObj).save();
        const settings = await settingsSchema.find();

        expect(settings).to.be.an('array').that.have.lengthOf(2);
        expect(settings[1].guildId).to.equal('987656789');
        expect(settings[1].notif.current).to.equal(settingsObj.notif.current);
        expect(settings[1].notif.added).to.equal(settingsObj.notif.added);
        expect(settings[1].notif.removed).to.equal(settingsObj.notif.removed);
        expect(settings[1].notif.radio).to.equal('off');
        expect(settings[1].audio.volume).to.equal(settingsObj.audio.volume);
    });

    it('get() Get second settings', async () => {
        const settings = await settingsSchema.get(settingsObj.guildId);
        if (settings) {
            expect(settings.guildId).to.equal('987656789');
            expect(settings.notif.current).to.equal(settingsObj.notif.current);
            expect(settings.notif.added).to.equal(settingsObj.notif.added);
            expect(settings.notif.removed).to.equal(settingsObj.notif.removed);
            expect(settings.notif.radio).to.equal('off');
            expect(settings.audio.volume).to.equal(settingsObj.audio.volume);
        }
    });

    it('Should drop test database', async () => {
        mongoose.connection.db.dropDatabase();
        const settings = await settingsSchema.find();

        expect(settings).to.be.an('array').that.is.empty;
    });
});