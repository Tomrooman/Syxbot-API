/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import dofusSchema from '../../lib/models/dofus';
import chai from 'chai';

const expect = chai.expect;

export const dofusModel = (): void => {
    after(async () => {
        await dofusSchema.deleteMany({});
    });

    it('Dofus should be empty', async () => {
        const dofus = await dofusSchema.find();
        expect(dofus).to.be.an('array').that.is.empty;
    });

    it('get() => Dofus should be empty', async () => {
        const dofus = await dofusSchema.get('1234554321');
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
};
