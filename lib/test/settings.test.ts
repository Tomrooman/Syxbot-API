import settingsSchema from '../models/settings';
import chai from 'chai';
import server from './../../index';
import { notifType, audioType, settingsType } from 'lib/@types/models/settings';

const expect = chai.expect;

describe('SETTINGS', () => {
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

    describe('Routes', () => {
        let session: { jwt: string, token: string, type: string };

        before(() => {
            session = global.BOTsession;
        });

        after(async () => {
            await settingsSchema.deleteMany({});
        });

        it('/settings => Settings should be empty', done => {
            chai.request(server)
                .post('/settings')
                .send(session)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array').that.have.lengthOf(0);
                    done();
                });
        });

        it('/settings/update => Add settings', done => {
            chai.request(server)
                .post('/settings/update')
                .send({ ...session, ...settingsObj })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(6);
                    expect(res.body._id).to.be.string;
                    expect(res.body.guildId).to.equal(settingsObj.guildId);
                    expect(res.body.notif).to.deep.equal(settingsObj.notif);
                    expect(res.body.audio).to.deep.equal(settingsObj.audio);
                    done();
                });
        });

        it('/settings => Get all settings', done => {
            chai.request(server)
                .post('/settings')
                .send({ ...session, ...settingsObj })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array').that.have.lengthOf(1);
                    expect(res.body[0]._id).to.be.string;
                    expect(res.body[0].guildId).to.equal(settingsObj.guildId);
                    expect(res.body[0].notif).to.deep.equal(settingsObj.notif);
                    expect(res.body[0].audio).to.deep.equal(settingsObj.audio);
                    done();
                });
        });

        it('/settings/update => Update settings', done => {
            const updatedSettings = {
                guildId: settingsObj.guildId,
                notif: {
                    current: 'off',
                    added: 'on',
                    removed: 'on',
                    radio: 'off'
                },
                audio: {
                    volume: 0.5
                }
            }
            chai.request(server)
                .post('/settings/update')
                .send({ ...session, ...updatedSettings })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(6);
                    expect(res.body._id).to.be.string;
                    expect(res.body.guildId).to.equal(settingsObj.guildId);
                    expect(res.body.notif).to.deep.equal(updatedSettings.notif);
                    expect(res.body.audio).to.deep.equal(updatedSettings.audio);
                    done();
                });
        });

        it('/settings/update => Return false without guildId', done => {
            const falsySettings = {
                ...settingsObj,
                guildId: undefined
            }
            chai.request(server)
                .post('/settings/update')
                .send({ ...session, ...falsySettings })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });

        it('/settings/update => Return false without notif data', done => {
            const falsySettings = {
                ...settingsObj,
                notif: undefined
            }
            chai.request(server)
                .post('/settings/update')
                .send({ ...session, ...falsySettings })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });

        it('/settings/update => Return false without audio data', done => {
            const falsySettings = {
                ...settingsObj,
                audio: undefined
            }
            chai.request(server)
                .post('/settings/update')
                .send({ ...session, ...falsySettings })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });
    });

    describe('Model', () => {
        let savedSettings: settingsType;

        after(async () => {
            await settingsSchema.deleteMany({});
        });

        it('Must not save without one property', async () => {
            const modifiedGuildId = {
                ...settingsObj,
                guildId: undefined
            }
            const modifiedNotif = {
                ...settingsObj,
                notif: undefined
            }
            const modifiedAudio = {
                ...settingsObj,
                audio: undefined
            }
            let settings = new settingsSchema(modifiedGuildId);
            let err = settings.validateSync();
            expect(err).to.exist;
            settings = new settingsSchema(modifiedNotif);
            err = settings.validateSync();
            expect(err).to.exist;
            settings = new settingsSchema(modifiedAudio);
            err = settings.validateSync();
            expect(err).to.exist;
        });

        it('getAllSettings() => Settings should be empty', async () => {
            const allSettings = await settingsSchema.getAllSettings();
            expect(allSettings).to.be.an('array').that.have.lengthOf(0);
        });

        it('createSettings() => Add settings', async () => {
            const settings = await settingsSchema.createSettings(settingsObj.guildId, settingsObj.notif, settingsObj.audio) as settingsType;
            const noGuildId = await settingsSchema.createSettings('', settingsObj.notif, settingsObj.audio);
            const noNotif = await settingsSchema.createSettings(settingsObj.guildId, {} as notifType, settingsObj.audio);
            const noAudio = await settingsSchema.createSettings(settingsObj.guildId, settingsObj.notif, {} as audioType);
            expect(Object.keys(settings)).to.be.an('array').that.have.lengthOf(6);
            expect(settings._id).to.be.string;
            expect(settings.guildId).to.equal(settingsObj.guildId);
            expect(Object.keys(settings.notif)).to.deep.equal(Object.keys(settingsObj.notif));
            expect(Object.values(settings.notif)).to.deep.equal(Object.values(settingsObj.notif));
            expect(Object.keys(settings.audio)).to.deep.equal(Object.keys(settingsObj.audio));
            expect(Object.values(settings.audio)).to.deep.equal(Object.values(settingsObj.audio));
            expect(noGuildId).to.be.false;
            expect(noNotif).to.be.false;
            expect(noAudio).to.be.false;
        });

        it('getAllSettings() => Get all settings', async () => {
            const allSettings = await settingsSchema.getAllSettings();
            expect(allSettings).to.be.an('array').that.have.lengthOf(1);
        });

        it('get() => Get one settings by guildId', async () => {
            const settings = await settingsSchema.get(settingsObj.guildId) as settingsType;
            const noSettings = await settingsSchema.get('') as settingsType;
            const falseSettings = await settingsSchema.get('88888888') as settingsType;
            expect(Object.keys(settings.toObject())).to.be.an('array').that.have.lengthOf(6);
            expect(settings.guildId).to.equal(settingsObj.guildId);
            expect(Object.keys(settings.toObject().notif)).to.deep.equal(Object.keys(settingsObj.notif));
            expect(Object.values(settings.toObject().notif)).to.deep.equal(Object.values(settingsObj.notif));
            expect(Object.keys(settings.toObject().audio)).to.deep.equal(Object.keys(settingsObj.audio));
            expect(Object.values(settings.toObject().audio)).to.deep.equal(Object.values(settingsObj.audio));
            expect(noSettings).to.be.false;
            expect(falseSettings).to.be.false;
            savedSettings = settings;
        });

        it('updateSettings() => Update settings', async () => {
            const updatedSettings = {
                guildId: settingsObj.guildId,
                notif: {
                    current: 'off',
                    added: 'on',
                    removed: 'on',
                    radio: 'off'
                },
                audio: {
                    volume: 0.5
                }
            }
            const settings = await settingsSchema.updateSettings(savedSettings, updatedSettings.notif, updatedSettings.audio) as settingsType;
            const noGuildId = await settingsSchema.updateSettings({} as settingsType, settingsObj.notif, settingsObj.audio);
            const noNotif = await settingsSchema.updateSettings(savedSettings, {} as notifType, settingsObj.audio);
            const noAudio = await settingsSchema.updateSettings(savedSettings, settingsObj.notif, {} as audioType);
            expect(Object.keys(settings.toObject())).to.be.an('array').that.have.lengthOf(6);
            expect(settings.guildId).to.equal(settingsObj.guildId);
            expect(Object.keys(settings.toObject().notif)).to.deep.equal(Object.keys(updatedSettings.notif));
            expect(Object.values(settings.toObject().notif)).to.deep.equal(Object.values(updatedSettings.notif));
            expect(Object.keys(settings.toObject().audio)).to.deep.equal(Object.keys(updatedSettings.audio));
            expect(Object.values(settings.toObject().audio)).to.deep.equal(Object.values(updatedSettings.audio));
            expect(noGuildId).to.be.false;
            expect(noNotif).to.be.false;
            expect(noAudio).to.be.false;
        });
    });
});