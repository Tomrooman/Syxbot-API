/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';
import { dofusType, userNotifInfos } from 'lib/@types/models/dofus';

const expect = chai.expect;

export const dofusModel = (): void => {
    const dofusObj = {
        userId: '1234554321'
    };
    const secondDofusObj = {
        userId: '2'
    };
    const thirdDofusObj = {
        userId: '3'
    };

    after(async () => {
        await dofusSchema.deleteMany({});
    });

    it('Dofus should be empty', async () => {
        const dofus = await dofusSchema.find();
        expect(dofus).to.be.an('array').that.is.empty;
    });

    it('get() => Dofus should be empty', async () => {
        const dofus = await dofusSchema.get(dofusObj.userId);
        expect(dofus).to.be.false;
    });

    it('get() => Return false without userId', async () => {
        const dofus = await dofusSchema.get('');
        expect(dofus).to.be.false;
    });

    it('getDragodindesIfFecondExist() => Return false without dofus data', async () => {
        const dofus = await dofusSchema.getDragodindesIfFecondExist();
        expect(dofus).to.be.false;
    });

    it('getAllDragodindesNotifInfos() => Return false without dofus data', async () => {
        const dofus = await dofusSchema.getAllDragodindesNotifInfos();
        expect(dofus).to.be.false;
    });

    it('getDragodindes() => Return false without dofus data or userId', async () => {
        let dofus = await dofusSchema.getDragodindes(dofusObj.userId);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.getDragodindes('');
        expect(dofus).to.be.false;
    });

    it('setDragodindesToSended() => Return false without notifArray', async () => {
        const dofus = await dofusSchema.setDragodindesToSended([]);
        expect(dofus).to.be.false;
    });

    it('createNotificationStatus() => Return dofus data only with userId & status', async () => {
        let dofus = await dofusSchema.createNotificationStatus('', 'on') as dofusType;
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createNotificationStatus(dofusObj.userId, '') as dofusType;
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createNotificationStatus(dofusObj.userId, 'on') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userId).to.equal(dofusObj.userId);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
        dofus = await dofusSchema.createNotificationStatus(secondDofusObj.userId, 'on') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userId).to.equal(secondDofusObj.userId);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
        dofus = await dofusSchema.createNotificationStatus(thirdDofusObj.userId, 'off') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userId).to.equal(thirdDofusObj.userId);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.false;
    });

    it('get() => Return dofus data', async () => {
        const dofus = await dofusSchema.get(dofusObj.userId) as dofusType;
        expect(Object.keys(dofus.toObject())).to.be.an('array').that.have.lengthOf(5);
        expect(dofus._id).to.exist;
        expect(dofus.userId).to.equal(dofusObj.userId);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
    });

    it('getAllDragodindesNotifInfos() => Return dofus data', async () => {
        const dofus = await dofusSchema.getAllDragodindesNotifInfos() as userNotifInfos[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(Object.keys(dofus[0])).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].userId).to.equal(dofusObj.userId);
        expect(dofus[0].notif).to.be.true;
        expect(Object.keys(dofus[1])).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[1].userId).to.equal(secondDofusObj.userId);
        expect(dofus[1].notif).to.be.true;
    });
};
