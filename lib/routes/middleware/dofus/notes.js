'use strict';

import dofusModel from './../../../models/dofus.js';

const getNotes = async (req, res, next) => {
    if (req.body.userId) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            res.notes = allDofusInfos.notes;
        }
    }
    next();
};

const createOrAddNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
        let notes = false;
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            notes = await dofusModel.addNotes(allDofusInfos, req.body.title, req.body.content);

        }
        else {
            notes = await dofusModel.createNotes(req.body.userId, req.body.title, req.body.content);
        }
        res.notes = notes;
    }
    next();
};

const updateNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.oldContent && req.body.newContent) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const title = req.body.title;
            const oldContent = req.body.oldContent;
            const newContent = req.body.newContent;
            const notes = await dofusModel.updateNotes(allDofusInfos, title, oldContent, newContent);
            res.notes = notes;
        }
    }
    next();
};

const removeNotes = async (req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const notes = await dofusModel.removeNotes(allDofusInfos, req.body.title, req.body.content);
            res.notes = notes;
        }
    }
    next();
};

exports.getNotes = getNotes;
exports.createOrAddNotes = createOrAddNotes;
exports.updateNotes = updateNotes;
exports.removeNotes = removeNotes;