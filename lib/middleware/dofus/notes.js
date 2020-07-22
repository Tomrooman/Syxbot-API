'use strict';

import dofusInfosModel from '../../models/dofus_infos';

const getNotes = async (req, res, next) => {
    if (req.body.userId) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            res.notes = allDofusInfos.notes;
        }
    }
    next();
};

const createOrAddNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
        let notes = false;
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            notes = await dofusInfosModel.addNotes(allDofusInfos, req.body.title, req.body.content);

        }
        else {
            notes = await dofusInfosModel.createNotes(req.body.userId, req.body.title, req.body.content);
        }
        res.notes = notes;
    }
    next();
};

const updateNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.oldContent && req.body.newContent) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const title = req.body.title;
            const oldContent = req.body.oldContent;
            const newContent = req.body.newContent;
            const notes = await dofusInfosModel.updateNotes(allDofusInfos, title, oldContent, newContent);
            res.notes = notes;
        }
    }
    next();
};

const removeNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const notes = await dofusInfosModel.removeNotes(allDofusInfos, req.body.title, req.body.content);
            res.notes = notes;
        }
    }
    next();
};

export {
    getNotes,
    createOrAddNotes,
    updateNotes,
    removeNotes
};
