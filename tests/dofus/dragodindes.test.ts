/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';
import _ from 'lodash';
import server from '../../index';

const expect = chai.expect;

export const dragodindes = (): void => {
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
    const thirdDragoObj = {
        ...dragodindesObj,
        name: 'Pourpre et Emeraude',
        generation: 4,
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

    it('/dofus/dragodindes/fecondator/automatic => Return 400 + false with no dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automatic')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automatic => Return 400 + false with empty data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automatic')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: [], used: [] } })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automatic => Return 400 + false with no dofus data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automatic')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: ['fake data'] } })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/notif => Return 400 + false if no status', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/notif/verify => Return 400 + false ', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif/verify')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/remove => Return 400 + false with no dofus data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: ['fake value'] })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/remove => Return 400 + false with no dragodindes to remove', done => {
        chai.request(server)
            .post('/dofus/dragodindes/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [] })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/used/remove => Return 400 + false if no data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/used/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [{ name: secondDragoObj.name }] })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/used/update => Return 400 + false if no dragodindes send', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/used/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/notif => Return 201 + dofus data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, status: 'on' })
            .end(async (_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.notif).to.be.true;
                expect(res.body.dragodindes).to.be.an('array').that.is.empty;
                expect(res.body.enclos).to.be.an('array').that.is.empty;
                await dofusSchema.deleteMany({});
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

    it('/dofus/dragodindes/create => Return 201 + existing dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [thirdDragoObj] })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(Object.keys(res.body[1])).that.have.lengthOf(6);
                expect(res.body[2]).to.deep.include(thirdDragoObj);
                done();
            });
    });

    it('/dofus/dragodindes/create => Send empty dragodindes # return 400 + false', done => {
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
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(3);
                expect(res.body.dragodindes[0].name).to.equal(thirdDragoObj.name);
                expect(res.body.dragodindes[1].name).to.equal(secondDragoObj.name);
                expect(res.body.dragodindes[2].name).to.equal(dragodindesObj.name);
                expect(res.body.dragodindes[0].end.time).to.equal('Maintenant');
                expect(res.body.dragodindes[1].end.time).to.equal('Maintenant');
                expect(res.body.dragodindes[2].end.time).to.equal((secondDragoObj.duration - dragodindesObj.duration) + 'H');
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automatic => Return 200 + last dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automatic')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: [secondDragoObj] } })
            .end((_err, res) => {
                const secondDrago = _.find(res.body, { name: secondDragoObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(secondDrago.name).to.equal(secondDragoObj.name);
                expect(secondDrago.duration).to.equal(secondDragoObj.duration);
                expect(secondDrago.generation).to.equal(secondDragoObj.generation);
                expect(secondDrago.sended).to.be.true;
                expect(secondDrago.used).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/remove => Remove dragodinde & return 200 + existing dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [{ name: thirdDragoObj.name }] })
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(2);
                done();
            });
    });

    it('/dofus/dragodindes/fecondator => Return 200 + formatted dragodindes with another case', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.ddFecond.name).to.equal(secondDragoObj.name);
                expect(Object.keys(res.body.ddFecond)).to.be.an('array').that.have.lengthOf(6);
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(1);
                expect(res.body.dragodindes[0].name).to.equal(dragodindesObj.name);
                expect(res.body.dragodindes[0].end.time).to.equal((secondDragoObj.duration - dragodindesObj.duration) + 'H');
                done();
            });
    });

    it('/dofus/dragodindes/create => Return 201 + existing dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/create')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [thirdDragoObj] })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(Object.keys(res.body[1])).that.have.lengthOf(6);
                expect(res.body[2]).to.deep.include(thirdDragoObj);
                done();
            });
    });

    it('/dofus/dragodindes/notif => Send status ON + return 201/notif true', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, status: 'on' })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.notif).to.be.true;
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(3);
                done();
            });
    });

    it('/dofus/dragodindes/notif/all => Return 200 + dofus data', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif/all')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(1);
                done();
            });
    });

    it('/dofus/dragodindes/notif/verify => Return 200 + dragodindes to send', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif/verify')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res.body).to.be.an('array').that.have.lengthOf(1);
                expect(res.body[0].dragodindes).to.be.an('array').that.have.lengthOf(1);
                expect(res.body[0].dragodindes[0].name).to.equal(thirdDragoObj.name);
                expect(res.body[0].dragodindes[0].end.time).to.equal('Maintenant');
                expect(res.body[0].dragodindes[0].sended).to.be.true;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/dofus/dragodindes/fecondator/automatic => Return 200 + last & used dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/fecondator/automatic')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: { last: [thirdDragoObj], used: [secondDragoObj] } })
            .end((_err, res) => {
                const firstDrago = _.find(res.body, { name: dragodindesObj.name });
                const secondDrago = _.find(res.body, { name: secondDragoObj.name });
                const thirdDrago = _.find(res.body, { name: thirdDragoObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(firstDrago.name).to.equal('Amande et Emeraude');
                expect(firstDrago.duration).to.equal(100);
                expect(firstDrago.generation).to.equal(3);
                expect(firstDrago.sended).to.be.false;
                expect(firstDrago.used).to.be.false;
                expect(firstDrago.last.status).to.be.false;
                expect(secondDrago.name).to.equal('Ivoire et Pourpre');
                expect(secondDrago.duration).to.equal(120);
                expect(secondDrago.generation).to.equal(5);
                expect(secondDrago.sended).to.be.true;
                expect(secondDrago.used).to.be.true;
                expect(secondDrago.last.status).to.be.false;
                expect(thirdDrago.name).to.equal('Pourpre et Emeraude');
                expect(thirdDrago.duration).to.equal(120);
                expect(thirdDrago.generation).to.equal(4);
                expect(thirdDrago.sended).to.be.true;
                expect(thirdDrago.used).to.be.false;
                expect(thirdDrago.last.status).to.be.true;
                done();
            });
    });

    it('/dofus/dragodindes/notif => Return 201 + notif OFF', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, status: 'off' })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.notif).to.be.false;
                expect(res.body.dragodindes).to.be.an('array').that.have.lengthOf(3);
                done();
            });
    });

    it('/dofus/dragodindes/notif/verify => Return 400 + false if notif off', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif/verify')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/last/update => Return 200 + updated last dragodinde', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/last/update')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [dragodindesObj] })
            .end((_err, res) => {
                const firstDrago = _.find(res.body, { name: dragodindesObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(firstDrago.last.status).to.be.true;
                expect(firstDrago.sended).to.be.true;
                expect(firstDrago.used).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/last/remove => Return 200 + updated last dragodinde', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/last/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [dragodindesObj] })
            .end((_err, res) => {
                const firstDrago = _.find(res.body, { name: dragodindesObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(firstDrago.sended).to.be.false;
                expect(firstDrago.last.status).to.be.false;
                expect(firstDrago.used).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/used/remove => Return 200 + updated used dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/used/remove')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [{ name: secondDragoObj.name }] })
            .end((_err, res) => {
                const secondDrago = _.find(res.body, { name: secondDragoObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(secondDrago.sended).to.be.false;
                expect(secondDrago.used).to.be.false;
                expect(secondDrago.last.status).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/status/used/update => Return 200 + updated used dragodindes', done => {
        chai.request(server)
            .post('/dofus/dragodindes/status/used/update')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, dragodindes: [{ name: secondDragoObj.name }] })
            .end((_err, res) => {
                const secondDrago = _.find(res.body, { name: secondDragoObj.name });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(3);
                expect(secondDrago.sended).to.be.true;
                expect(secondDrago.used).to.be.true;
                expect(secondDrago.last.status).to.be.false;
                done();
            });
    });

    it('/dofus/dragodindes/notif/all => Return 400 + false if notif off', done => {
        chai.request(server)
            .post('/dofus/dragodindes/notif/all')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });
};