/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import chai from 'chai';
import server from '../index';

const expect = chai.expect;

describe('CONTACT', () => {
    describe('Routes', () => {
        let websiteCookies: string;
        let websiteSession: { type: string, token: string };

        before(() => {
            websiteCookies = global.websiteCookies;
            websiteSession = global.websiteSession;
        });

        it('/contact => Get false + status 200', done => {
            chai.request(server)
                .post('/contact')
                .set('Cookie', websiteCookies)
                .send({ ...websiteSession, message: 'testMsg', mail: 'fake@fake.com', object: 'better', test: 'yes' })
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.false;
                    done();
                });
        });
        it('/contact => Get false + status 400 without a data', done => {
            chai.request(server)
                .post('/contact')
                .set('Cookie', websiteCookies)
                .send({ ...websiteSession, mail: 'fake@fake.com', object: 'better', test: 'yes' })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });
    });
});