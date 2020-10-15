import chai from 'chai';
import chaiHttp from 'chai-http';
import config from './../../config.json';
import server from './../../index';

const expect = chai.expect;

chai.use(chaiHttp);

describe('SESSION', () => {
    it('Create bot session', done => {
        chai.request(server)
            .post('/bot/auth')
            .send({ token: config.security.token, type: 'bot' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object').that.have.property('jwt');
                const BOTsession = {
                    jwt: res.body.jwt,
                    token: config.security.token,
                    type: 'bot'
                };
                global.BOTsession = BOTsession;
                done();
            });
    });

});


import './settings.test';
// import './token.test';
