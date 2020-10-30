/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';
import { dofusType, dragodindeType, userNotifInfos } from 'lib/@types/models/dofus';

const expect = chai.expect;

export const dofusModel = (): void => {
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
    const dofusObj = {
        userID: '1234554321'
    };
    const secondDofusObj = {
        userID: '222222'
    };
    const thirdDofusObj = {
        userID: '333333'
    };

    after(async () => {
        await dofusSchema.deleteMany({});
    });

    it('Dofus should be empty', async () => {
        const dofus = await dofusSchema.find();
        expect(dofus).to.be.an('array').that.is.empty;
    });

    it('get() => Dofus should be empty', async () => {
        const dofus = await dofusSchema.get(dofusObj.userID);
        expect(dofus).to.be.false;
    });

    it('get() => Return false without userID', async () => {
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

    it('getDragodindes() => Return false without dofus data or userID', async () => {
        let dofus = await dofusSchema.getDragodindes(dofusObj.userID);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.getDragodindes('');
        expect(dofus).to.be.false;
    });

    it('setDragodindesToSended() => Return false without notifArray', async () => {
        const dofus = await dofusSchema.setDragodindesToSended([]);
        expect(dofus).to.be.false;
    });

    it('createNotificationStatus() => Return dofus data only with userID & status', async () => {
        let dofus = await dofusSchema.createNotificationStatus('', 'on') as dofusType;
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createNotificationStatus(dofusObj.userID, '') as dofusType;
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createNotificationStatus(dofusObj.userID, 'on') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userID).to.equal(dofusObj.userID);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
        dofus = await dofusSchema.createNotificationStatus(secondDofusObj.userID, 'on') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userID).to.equal(secondDofusObj.userID);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
        dofus = await dofusSchema.createNotificationStatus(thirdDofusObj.userID, 'off') as dofusType;
        expect(dofus._id).to.exist;
        expect(dofus.userID).to.equal(thirdDofusObj.userID);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.false;
    });

    it('get() => Return dofus data', async () => {
        const dofus = await dofusSchema.get(dofusObj.userID) as dofusType;
        expect(Object.keys(dofus)).to.be.an('array').that.have.lengthOf(5);
        expect(dofus._id).to.exist;
        expect(dofus.userID).to.equal(dofusObj.userID);
        expect(dofus.enclos).to.be.an('array').that.is.empty;
        expect(dofus.dragodindes).to.be.an('array').that.is.empty;
        expect(dofus.notif).to.be.true;
    });

    it('getAllDragodindesNotifInfos() => Return dofus data', async () => {
        const dofus = await dofusSchema.getAllDragodindesNotifInfos() as userNotifInfos[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(Object.keys(dofus[0])).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].userID).to.equal(dofusObj.userID);
        expect(dofus[0].notif).to.be.true;
        expect(Object.keys(dofus[1])).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[1].userID).to.equal(secondDofusObj.userID);
        expect(dofus[1].notif).to.be.true;
    });

    it('addDragodindes() => Add dragodindes and return dragodindes', async () => {
        const dofusGet = await dofusSchema.get(dofusObj.userID) as dofusType;
        let dofus = await dofusSchema.addDragodindes(dofusGet, []);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.addDragodindes({} as dofusType, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.addDragodindes(dofusGet, [dragodindesObj, secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].last.status).to.equal(dragodindesObj.last.status);
        expect(dofus[0].used).to.equal(dragodindesObj.used);
        expect(dofus[0].sended).to.equal(dragodindesObj.sended);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0].duration).to.equal(dragodindesObj.duration);
        expect(dofus[0].generation).to.equal(dragodindesObj.generation);
        expect(dofus[1].last.status).to.equal(secondDragoObj.last.status);
        expect(dofus[1].used).to.equal(secondDragoObj.used);
        expect(dofus[1].sended).to.equal(secondDragoObj.sended);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1].duration).to.equal(secondDragoObj.duration);
        expect(dofus[1].generation).to.equal(secondDragoObj.generation);
    });

    it('createDragodindes() => Create dofus data and return dragodindes', async () => {
        await dofusSchema.deleteOne({ userID: secondDofusObj.userID });
        let dofus = await dofusSchema.createDragodindes('', [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createDragodindes(secondDofusObj.userID, []);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.createDragodindes(secondDofusObj.userID, [dragodindesObj, secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].last.status).to.equal(dragodindesObj.last.status);
        expect(dofus[0].used).to.equal(dragodindesObj.used);
        expect(dofus[0].sended).to.equal(dragodindesObj.sended);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0].duration).to.equal(dragodindesObj.duration);
        expect(dofus[0].generation).to.equal(dragodindesObj.generation);
        expect(dofus[1].last.status).to.equal(secondDragoObj.last.status);
        expect(dofus[1].used).to.equal(secondDragoObj.used);
        expect(dofus[1].sended).to.equal(secondDragoObj.sended);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1].duration).to.equal(secondDragoObj.duration);
        expect(dofus[1].generation).to.equal(secondDragoObj.generation);
    });

    it('removeDragodindes() => Remove dragodindes and return dragodindes', async () => {
        const dofusGet = await dofusSchema.get(dofusObj.userID) as dofusType;
        const dragoGet = dofusGet.dragodindes;
        let dofus = await dofusSchema.removeDragodindes({} as dofusType, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.removeDragodindes(dofusGet, []);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.removeDragodindes(dofusGet, [dragodindesObj]) as dragodindeType[];
        expect(dragoGet).to.be.an('array').that.have.lengthOf(2);
        expect(dofus).to.be.an('array').that.have.lengthOf(1);
        expect(dofus[0].last.status).to.equal(secondDragoObj.last.status);
        expect(dofus[0].used).to.equal(secondDragoObj.used);
        expect(dofus[0].sended).to.equal(secondDragoObj.sended);
        expect(dofus[0].name).to.equal(secondDragoObj.name);
        expect(dofus[0].duration).to.equal(secondDragoObj.duration);
        expect(dofus[0].generation).to.equal(secondDragoObj.generation);
    });

    it('setNotificationsByStatus() => Set dofus notif and return dofus data', async () => {
        const dofusGet = await dofusSchema.get(dofusObj.userID) as dofusType;
        const secondDofusGet = await dofusSchema.get(secondDofusObj.userID) as dofusType;
        const thirdDofusGet = await dofusSchema.get(thirdDofusObj.userID) as dofusType;
        const secondNotifGet = secondDofusGet.notif;
        const thirdNotifGet = thirdDofusGet.notif;
        let dofus = await dofusSchema.setNotificationsByStatus({} as dofusType, 'on');
        expect(dofus).to.be.false;
        dofus = await dofusSchema.setNotificationsByStatus(secondDofusGet, '');
        expect(dofus).to.be.false;
        dofus = await dofusSchema.setNotificationsByStatus(secondDofusGet, 'off') as dofusType;
        expect(dofusGet.notif).to.be.true;
        expect(secondNotifGet).to.be.false;
        expect(dofus.notif).to.be.false;
        dofus = await dofusSchema.setNotificationsByStatus(thirdDofusGet, 'on') as dofusType;
        expect(thirdNotifGet).to.be.false;
        expect(dofus.notif).to.be.true;
    });

    it('modifyLastDragodindes() => Modify last dragodindes and return dragodindes', async () => {
        const dofusGet = await dofusSchema.get(dofusObj.userID) as dofusType;
        const secondDofusGet = await dofusSchema.get(secondDofusObj.userID) as dofusType;
        const lastObj = { sended: true, used: false };
        const notLastObj = { ...lastObj, sended: false, last: { status: false } };
        let dofus = await dofusSchema.modifyLastDragodindes('update', secondDofusGet, []);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyLastDragodindes('update', {} as dofusType, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyLastDragodindes('', secondDofusGet, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyLastDragodindes('update', dofusGet, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyLastDragodindes('update', secondDofusGet, [dragodindesObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(lastObj);
        expect(dofus[0].last.status).to.be.true;
        expect(dofus[0].last.date).to.exist;
        dofus = await dofusSchema.modifyLastDragodindes('update', secondDofusGet, [secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(notLastObj);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1]).to.deep.include(lastObj);
        expect(dofus[1].last.status).to.be.true;
        expect(dofus[1].last.date).to.exist;
        dofus = await dofusSchema.modifyLastDragodindes('remove', secondDofusGet, [secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(notLastObj);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1]).to.deep.include(notLastObj);
    });

    it('automaticStatus() => Set dragodindes status with fecondator automatic data', async () => {
        const automaticDragodindes = {
            last: [dragodindesObj],
            used: [secondDragoObj]
        };
        const dofusGet = await dofusSchema.get(secondDofusObj.userID) as dofusType;
        let dofus = await dofusSchema.automaticStatus({} as dofusType, automaticDragodindes);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.automaticStatus(dofusGet, { last: [], used: [] });
        expect(dofus).to.be.false;
        dofus = await dofusSchema.automaticStatus(dofusGet, automaticDragodindes) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0].sended).to.be.true;
        expect(dofus[0].used).to.be.false;
        expect(dofus[0].last.status).to.be.true;
        expect(dofus[0].last.date).to.exist;
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1].sended).to.be.true;
        expect(dofus[1].used).to.be.true;
        expect(dofus[1].last.status).to.be.false;
        expect(dofus[1].last.date).to.not.exist;
    });

    it('modifyUsedDragodindes() => Modify used dragodindes and return dragodindes', async () => {
        const dofusGet = await dofusSchema.get(dofusObj.userID) as dofusType;
        const secondDofusGet = await dofusSchema.get(secondDofusObj.userID) as dofusType;
        const usedObj = { sended: true, last: { status: false }, used: true };
        const notUsedObj = { ...usedObj, sended: false, used: false };
        let dofus = await dofusSchema.modifyUsedDragodindes('update', secondDofusGet, []);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyUsedDragodindes('update', {} as dofusType, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyUsedDragodindes('', secondDofusGet, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyUsedDragodindes('update', dofusGet, [dragodindesObj]);
        expect(dofus).to.be.false;
        dofus = await dofusSchema.modifyUsedDragodindes('update', secondDofusGet, [dragodindesObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(usedObj);
        dofus = await dofusSchema.modifyUsedDragodindes('update', secondDofusGet, [secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(usedObj);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1]).to.deep.include(usedObj);
        dofus = await dofusSchema.modifyUsedDragodindes('remove', secondDofusGet, [secondDragoObj]) as dragodindeType[];
        expect(dofus).to.be.an('array').that.have.lengthOf(2);
        expect(dofus[0].name).to.equal(dragodindesObj.name);
        expect(dofus[0]).to.deep.include(usedObj);
        expect(dofus[1].name).to.equal(secondDragoObj.name);
        expect(dofus[1]).to.deep.include(notUsedObj);
    });
};
