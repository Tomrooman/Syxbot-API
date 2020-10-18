/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import chai from 'chai';
import server from '../index';

const expect = chai.expect;

describe('SECURITY', () => {
    describe('Website', () => {
        let customWebsiteCookies: string;
        let badWebsiteCookies: string;
        let websiteCookies: string;
        let websiteSession: { type: string, token: string };

        before(() => {
            customWebsiteCookies = global.customWebsiteCookies;
            badWebsiteCookies = global.badWebsiteCookies;
            websiteCookies = global.websiteCookies;
            websiteSession = global.websiteSession;
        });

        it('/ => Return 400 without any data', done => {
            chai.request(server)
                .post('/')
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 without cookie', done => {
            chai.request(server)
                .post('/')
                .send({ ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 with bad token', done => {
            chai.request(server)
                .post('/')
                .set('Cookie', websiteCookies)
                .send({ ...websiteSession, token: 'badToken' })
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 with bad cookies', done => {
            chai.request(server)
                .post('/')
                .set('Cookie', badWebsiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 with jwt false hash', done => {
            chai.request(server)
                .post('/')
                .set('Cookie', customWebsiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 200 with all good data', done => {
            chai.request(server)
                .post('/')
                .set('Cookie', websiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.is.empty;
                    done();
                });
        });
    });

    describe('Bot', () => {
        let session: { jwt: string, token: string, type: string };

        before(() => {
            session = global.BOTsession;
        });

        it('/ => Return 401 with false jwt data', done => {
            chai.request(server)
                .post('/')
                .send({ ...session, jwt: 'badJsonToken' })
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 without jwt data', done => {
            const withoutJwt = {
                ...session,
                jwt: undefined
            };
            chai.request(server)
                .post('/')
                .send(withoutJwt)
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 401 with bad token', done => {
            const withoutToken = {
                ...session,
                token: 'badtoken'
            };
            chai.request(server)
                .post('/')
                .send(withoutToken)
                .end((_err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal('Invalid data');
                    done();
                });
        });

        it('/ => Return 200 with all good data', done => {
            chai.request(server)
                .post('/')
                .send(session)
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.is.empty;
                    done();
                });
        });
    });
});