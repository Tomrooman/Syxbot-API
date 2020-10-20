/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';
import _ from 'lodash';
import server from '../../index';

const expect = chai.expect;

export const dragodindes = () => {
    const dragodindesObj = {
        name: 'Amande et Emeraude',
        duration: 100,
        generation: 3,
        used: false,
        last: {
            status: false
        },
        sended: false
    };
    const secondDragoObj = {
        ...dragodindesObj,
        name: 'Ivoire et Pourpre',
        generation: 5,
        duration: 120
    };
    let websiteCookies: string;
    let websiteSession: { type: string, token: string };

    before(() => {
        websiteCookies = global.websiteCookies;
        websiteSession = global.websiteSession;
    });

    after(async () => {
        await dofusSchema.deleteMany({});
    });

    it('/dofus/dragodindes => Return 200 + false if does not exist', done => {
        chai.request(server)
            .post('/dofus/dragodindes')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator => Return 400 + false with no dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.dragodindes).to.be.false;
                expect(res.body.ddFecond).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automate => Return 400 + false with no dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automate')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automate => Return 400 + false with empty data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automate')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: [], used: [] } })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/create => Return 201 + created dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [dragodindesObj] })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(1);
                expect(Object.keys(res.body[0])).that.have.lengthOf(6);
                expect(res.body[0]).to.deep.include(dragodindesObj);
                done();
            });
    });

    it('/dofus/dragodindes/create => Return 201 + existing dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [secondDragoObj] })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(2);
                expect(Object.keys(res.body[0])).that.have.lengthOf(6);
                expect(res.body[0]).to.deep.include(dragodindesObj);
                expect(Object.keys(res.body[1])).that.have.lengthOf(6);
                expect(res.body[1]).to.deep.include(secondDragoObj);
                done();
            });
    });

    it('/dofus/dragodindes/create => Return 400 + false with empty dragodindes data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [] })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/create => Return 400 + false with no dragodindes data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator => Return 200 + formatted dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.ddFecond).to.be.false;
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(2);
                expect(res.body.dragodindes[0].name).to.equal(secondDragoObj.name);
                expect(res.body.dragodindes[1].name).to.equal(dragodindesObj.name);
                expect(res.body.dragodindes[0].end.time).to.equal('Maintenant');
                expect(res.body.dragodindes[1].end.time).to.equal((secondDragoObj.duration - dragodindesObj.duration) + 'H');
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automate => Return 400 + false with empty data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automate')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: [dragodindesObj], used: [secondDragoObj] } })
            .end((_err, res) => {
                const firstDrago = _.find(res.body.dragodindes, { name: dragodindesObj.name });
                const secondDrago = _.find(res.body.dragodindes, { name: secondDragoObj.name });
                expect(res).to.have.status(200);
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(2);
                console.log('First : ', firstDrago);
                console.log('Second : ', secondDrago);
                done();
            });
    });
}