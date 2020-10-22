/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import { enclos } from './enclos.test';
import { dragodindes } from './dragodindes.test';
// import { model } from './model.test';

describe('DOFUS', () => {
    describe('Routes', () => {
        describe('ENCLOS', enclos);
        describe('DRAGODINDES', dragodindes);
    });

    // describe('Model', model);
});