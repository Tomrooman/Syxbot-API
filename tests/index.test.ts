/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import chai from 'chai';
import chaiHttp from 'chai-http';
import Config from '../config.json';
import server from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const expect = chai.expect;

chai.use(chaiHttp);

describe('SESSION', () => {
    it('Create bot session', done => {
        chai.request(server)
            .post('/bot/auth')
            .send({ token: Config.security.token, type: 'bot' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object').that.have.property('jwt');
                const BOTsession = {
                    jwt: res.body.jwt,
                    token: Config.security.token,
                    type: 'bot'
                };
                global.BOTsession = BOTsession;
                done();
            });
    });

    it('Create website cookies', async () => {
        const hash = await bcrypt.hash(Config.security.secret, Config.bcrypt.saltRounds);
        const signature: string = jwt.sign({
            secret: hash,
            userID: '1234554321'
        }, Config.security.secret);
        const syxbot_infos = 'syxbot_infos=' + JSON.stringify({
            jwt: signature
        });
        const syxbot = 'syxbot=' + JSON.stringify({
            username: 'test_username',
            discriminator: '1111',
            token_type: 'test_type',
            countdown: true
        });
        const badSyxbotInfos = 'syxbot_infos=' + JSON.stringify({
            jwt: 'fakeToken'
        });
        const customSignature: string = jwt.sign({
            secret: 'fake hash',
            userID: '1234554321'
        }, Config.security.secret);
        const customSyxbotInfos = 'syxbot_infos=' + JSON.stringify({
            jwt: customSignature
        });
        global.websiteSession = { type: 'site', token: Config.security.token };
        global.websiteCookies = syxbot_infos + ';' + syxbot;
        global.badWebsiteCookies = badSyxbotInfos + ';' + syxbot;
        global.customWebsiteCookies = customSyxbotInfos + '.' + syxbot;
    });

});

import './security.test';
import './contact.test';
import './settings.test';
import './token.test';
import './dofus/index.test';
