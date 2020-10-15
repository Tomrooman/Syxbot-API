// import mongoose from 'mongoose';
import settingsSchema from '../models/settings';
import chai from 'chai';
// import chaiHttp from 'chai-http';
import server from './../../index';

const expect = chai.expect;

// chai.use(chaiHttp);

describe('SETTINGS', () => {
    let session: { jwt: string, token: string, type: string };
    let settingsObj = {
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

    describe('Api', () => {
        before(() => {
            session = global.BOTsession;
        });

        after((done) => {
            settingsSchema.deleteMany({}, (err) => {
                done();
            });
        });

        it('Settings should be empty', done => {
            chai.request(server)
                .post('/settings')
                .send(session)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array').that.have.lengthOf(0);
                    done();
                });
        });

        it('Add settings', done => {
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

        it('Update settings', done => {
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

        it('Must not create settings without guildId', done => {
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

        it('Must not create settings without notif object', done => {
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

        it('Must not create settings without audio object', done => {
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

    describe('Models', () => {

    });

});