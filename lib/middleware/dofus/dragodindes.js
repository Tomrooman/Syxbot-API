'use strict';

import dofusInfosModel from '../../models/dofus_infos';

const getAllDragodindesNotifInfos = async (req, res, next) => {
    const dragodindesNotif = await dofusInfosModel.getAllDragodindesNotifInfos();
    if (dragodindesNotif) {
        res.dragodindesNotif = dragodindesNotif;
    }
    next();
};

const getDofusInfos = async (req, res, next) => {
    if (req.body.userId) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            res.allDofusInfos = allDofusInfos;
        }
    }
    next();
};

const getDragodindes = async (req, res, next) => {
    if (req.body.userId) {
        const dragodindes = await dofusInfosModel.getDragodindes(req.body.userId);
        if (dragodindes) {
            res.dragodindes = dragodindes;
        }
    }
    next();
};

const SetNotificationsByStatus = async (req, res, next) => {
    let status = false;
    if (res.allDofusInfos && req.body.status) {
        status = await dofusInfosModel.setNotificationsByStatus(res.allDofusInfos, req.body.status);
        if (status) {
            res.dragodindes = status;
        }
    }
    else if (req.body.userId && !res.allDofusInfos && req.body.status) {
        status = await dofusInfosModel.createNotificationStatus(req.body.userId, req.body.status);
        if (status) {
            res.dragodindes = status;
        }
    }
    next();
};

const CreateOrAddDragodindes = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes) {
        let dragodindes = false;
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            dragodindes = await dofusInfosModel.addDragodindes(allDofusInfos, req.body.dragodindes);
        }
        else {
            dragodindes = await dofusInfosModel.createDragodindes(req.body.userId, req.body.dragodindes);
        }
        res.dragodindes = dragodindes;
    }
    next();
};

const modifyDragodindesStatus = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes && req.params.action && req.params.type) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos && req.body.dragodindes.length >= 1) {
            let dragodindes = false;
            const action = req.params.action;
            if (req.params.type === 'last') {
                dragodindes = await dofusInfosModel.modifyLastDragodindes(action, allDofusInfos, req.body.dragodindes);
            }
            else if (req.params.type === 'used') {
                dragodindes = await dofusInfosModel.modifyUsedDragodindes(action, allDofusInfos, req.body.dragodindes);
            }
            res.dragodindes = dragodindes;
        }
    }
    next();
};

const removeDragodindes = async (req, res, next) => {
    if (req.body.userId && req.body.dragodindes) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const dragodindes = await dofusInfosModel.removeDragodindes(allDofusInfos, req.body.dragodindes);
            res.dragodindes = dragodindes;
        }
    }
    next();
};

export {
    getAllDragodindesNotifInfos,
    getDofusInfos,
    getDragodindes,
    SetNotificationsByStatus,
    CreateOrAddDragodindes,
    modifyDragodindesStatus,
    removeDragodindes
};
