/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import chai from 'chai';
import server from '../../index';

const expect = chai.expect;

export const dragodindes = () => {
    let websiteCookies: string;
    let websiteSession: { type: string, token: string };

    before(() => {
        websiteCookies = global.websiteCookies;
        websiteSession = global.websiteSession;
    });

    it('/dofus/dragodindes => Return 200 + false if does not exist', done => {
        chai.request(server)
            .post('/dofus/dragodindes')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession })
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.false;
                done();
            });
    });
}