import assert from 'assert';
import mongoose from 'mongoose';
import settingsSchema from '../models/settings.js';

describe('Settings', function () {
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

    it('Settings should be empty', function (done) {
        settingsSchema.find()
            .then(users => {
                assert.equal(users.length, 0);
                done();
            });
    });
    it('Add first settings', function (done) {
        const promise = new settingsSchema(settingsObj).save();
        assert.ok(promise instanceof Promise);
        promise.then(() => {
            settingsSchema.find()
                .then(settings => {
                    assert.equal(settings.length, 1);
                    assert.equal(settings[0].guildId, settingsObj.guildId);
                    assert.equal(settings[0].notif.current, settingsObj.notif.current);
                    assert.equal(settings[0].notif.added, settingsObj.notif.added);
                    assert.equal(settings[0].notif.removed, settingsObj.notif.removed);
                    assert.equal(settings[0].notif.radio, settingsObj.notif.radio);
                    assert.equal(settings[0].audio.volume, settingsObj.audio.volume);
                    done();
                });
        });
    });
    it('get() Get first settings', function (done) {
        settingsSchema.get(settingsObj.guildId)
            .then(settings => {
                assert.equal(settings.guildId, settingsObj.guildId);
                assert.equal(settings.notif.current, settingsObj.notif.current);
                assert.equal(settings.notif.added, settingsObj.notif.added);
                assert.equal(settings.notif.removed, settingsObj.notif.removed);
                assert.equal(settings.notif.radio, settingsObj.notif.radio);
                assert.equal(settings.audio.volume, settingsObj.audio.volume);
                done();
            });
    });
    it('Add second settings', function (done) {
        settingsObj.guildId = '987656789';
        settingsObj.notif.radio = 'off';
        const promise = new settingsSchema(settingsObj).save();
        assert.ok(promise instanceof Promise);
        promise.then(() => {
            settingsSchema.find()
                .then(settings => {
                    assert.equal(settings.length, 2);
                    assert.equal(settings[1].guildId, '987656789');
                    assert.equal(settings[1].notif.current, settingsObj.notif.current);
                    assert.equal(settings[1].notif.added, settingsObj.notif.added);
                    assert.equal(settings[1].notif.removed, settingsObj.notif.removed);
                    assert.equal(settings[1].notif.radio, 'off');
                    assert.equal(settings[1].audio.volume, settingsObj.audio.volume);
                    done();
                });
        });
    });
    it('get() Get second settings', function (done) {
        settingsSchema.get(settingsObj.guildId)
            .then(settings => {
                assert.equal(settings.guildId, '987656789');
                assert.equal(settings.notif.current, settingsObj.notif.current);
                assert.equal(settings.notif.added, settingsObj.notif.added);
                assert.equal(settings.notif.removed, settingsObj.notif.removed);
                assert.equal(settings.notif.radio, 'off');
                assert.equal(settings.audio.volume, settingsObj.audio.volume);
                done();
            });
    });
    it('Should drop test database', function (done) {
        mongoose.connection.db.dropDatabase();
        settingsSchema.find()
            .then(settings => {
                assert.equal(settings.length, 0);
                done();
            });
    });
});