'use strict';

import dofusModel from './../../models/dofus.js';

const getDragodindes = async (req, res, next) => {
    if (req.body.userId) {
        const dragodindes = await dofusModel.getDragodindes(req.body.userId);
        if (dragodindes) {
            res.dragodindes = dragodindes;
        }
    }
    next();
};

const CreateOrAddDragodindes = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes) {
        let dragodindes = false;
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            dragodindes = await dofusModel.addDragodindes(allDofusInfos, req.body.dragodindes);
        }
        else {
            dragodindes = await dofusModel.createDragodindes(req.body.userId, req.body.dragodindes);
        }
        res.dragodindes = dragodindes;
    }
    next();
};

const modifyDragodindesStatus = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes && req.params.action && req.params.type) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos && req.body.dragodindes.length >= 1) {
            let dragodindes = false;
            if (req.params.type === 'last') {
                dragodindes = await dofusModel.modifyLastDragodindes(req.params.action, allDofusInfos, req.body.dragodindes);
            }
            else if (req.params.type === 'used') {
                dragodindes = await dofusModel.modifyUsedDragodindes(req.params.action, allDofusInfos, req.body.dragodindes);
            }
            res.dragodindes = dragodindes;
        }
    }
    next();
};

const removeDragodindes = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const dragodindes = await dofusModel.removeDragodindes(allDofusInfos, req.body.dragodindes);
            res.dragodindes = dragodindes;
        }
    }
    next();
};

exports.getDragodindes = getDragodindes;
exports.CreateOrAddDragodindes = CreateOrAddDragodindes;
exports.modifyDragodindesStatus = modifyDragodindesStatus;
exports.removeDragodindes = removeDragodindes;
