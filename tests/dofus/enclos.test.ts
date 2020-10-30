/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';
import server from '../../index';
import mongoose from 'mongoose';

const expect = chai.expect;

export const enclos = (): void => {
    const enclosObj = {
        title: 'testTitle',
        content: 'testContent'
    };
    const enclosObjBis = {
        title: 'secondTitle',
        content: 'secondContent'
    };
    let websiteCookies: string;
    let websiteSession: { type: string, token: string };
    let savedEnclos: {
        _id: mongoose.Types.ObjectId;
        title: string;
        content: string;
    };

    before(() => {
        websiteCookies = global.websiteCookies;
        websiteSession = global.websiteSession;
    });

    after(async () => {
        await dofusSchema.deleteMany({});
    });

    it('/dofus/enclos => Return 200 + false if does not exist', done => {
        chai.request(server)
            .post('/dofus/enclos')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 201 + false if does not exist', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: 'fake', action: 'remove' })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 201 + created enclos', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, ...enclosObj })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(1);
                expect(Object.keys(res.body[0])).that.have.lengthOf(3);
                expect(res.body[0]).to.deep.include(enclosObj);
                expect(mongoose.Types.ObjectId.isValid(res.body[0]._id)).to.be.true;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 201 + existing enclos', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, ...enclosObjBis })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(2);
                expect(Object.keys(res.body[1])).that.have.lengthOf(3);
                expect(res.body[1]).to.deep.include(enclosObjBis);
                expect(mongoose.Types.ObjectId.isValid(res.body[1]._id)).to.be.true;
                savedEnclos = res.body[1];
                done();
            });
    });

    it('/dofus/enclos => Return 200 + 2 enclos', done => {
        chai.request(server)
            .post('/dofus/enclos')
            .set('Cookie', websiteCookies)
            .send(websiteSession)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.have.lengthOf(2);
                expect(Object.keys(res.body[0])).that.have.lengthOf(3);
                expect(res.body[0]).to.deep.include(enclosObj);
                expect(mongoose.Types.ObjectId.isValid(res.body[0]._id)).to.be.true;
                expect(Object.keys(res.body[1])).that.have.lengthOf(3);
                expect(res.body[1]).to.deep.include(enclosObjBis);
                expect(mongoose.Types.ObjectId.isValid(res.body[1]._id)).to.be.true;
                expect(savedEnclos._id).to.equal(res.body[1]._id);
                done();
            });
    });

    it('/dofus/enclos/modify => Return 400 + false without content data', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, title: 'alone' })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 400 + false without title data', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, content: 'alone' })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 201 + updated enclos', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: savedEnclos._id, title: savedEnclos.title, content: 'modifiedContent' })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(2);
                expect(Object.keys(res.body[1])).that.have.lengthOf(3);
                expect(mongoose.Types.ObjectId.isValid(res.body[1]._id)).to.be.true;
                expect(res.body[1]._id).to.not.equal(savedEnclos._id);
                expect(res.body[1].title).to.equal(enclosObjBis.title);
                expect(res.body[1].content).to.equal('modifiedContent');
                savedEnclos = res.body[1];
                done();
            });
    });

    it('/dofus/enclos/modify => Return 400 + false without id data', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: undefined, content: 'fakeContent' })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 400 + false without content data', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: savedEnclos._id, content: undefined })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 201 + existing enclos for remove', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: savedEnclos._id, action: 'remove' })
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array').that.have.lengthOf(1);
                expect(Object.keys(res.body[0])).that.have.lengthOf(3);
                expect(res.body[0]).to.deep.include(enclosObj);
                expect(mongoose.Types.ObjectId.isValid(res.body[0]._id)).to.be.true;
                done();
            });
    });

    it('/dofus/enclos/modify => Return 400 + false without id for remove', done => {
        chai.request(server)
            .post('/dofus/enclos/modify')
            .set('Cookie', websiteCookies)
            .send({ ...websiteSession, enclosID: undefined, action: 'remove' })
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.false;
                done();
            });
    });
};