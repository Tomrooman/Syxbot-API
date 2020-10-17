/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import chai from 'chai';
import chaiHttp from 'chai-http';
import Config from './../../config.json';
import server from './../../index';
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
            userId: '1234554321'
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
        global.websiteSession = { type: 'site', token: Config.security.token };
        global.websiteCookies = syxbot_infos + ';' + syxbot;
    });

});


import './settings.test';
import './token.test';
