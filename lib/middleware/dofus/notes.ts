'use strict';

import dofusInfosModel from '../../models/dofus_infos';
import { noteType } from '../../@types/models/dofus_infos';
import { Request, Response, NextFunction } from 'express';

export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            res.notes = allDofusInfos.notes;
        }
    }
    next();
};

export const createOrAddNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        let notes: noteType[] | false = false;
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

export const updateNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const removeNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const notes = await dofusInfosModel.removeNotes(allDofusInfos, req.body.title, req.body.content);
            res.notes = notes;
        }
    }
    next();
};
