'use strict';

import dofusModel from '../../models/dofus';
import { enclosType } from '../../@types/models/dofus';
import { Request, Response, NextFunction } from 'express';

export const getEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) res.enclos = allDofusInfos.enclos;
        res.status(200);
    }
    next();
};

export const createOrAddEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        let enclos: enclosType[] | false = false;
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) enclos = await dofusModel.addEnclos(allDofusInfos, req.body.title, req.body.content);
        else enclos = await dofusModel.createEnclos(req.body.userId, req.body.title, req.body.content);
        res.enclos = enclos;
    }
    next();
};

export const updateEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.oldContent && req.body.newContent) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const title = req.body.title;
            const oldContent = req.body.oldContent;
            const newContent = req.body.newContent;
            const enclos = await dofusModel.updateEnclos(allDofusInfos, title, oldContent, newContent);
            res.enclos = enclos;
        }
    }
    next();
};

export const removeEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const enclos = await dofusModel.removeEnclos(allDofusInfos, req.body.title, req.body.content);
            res.enclos = enclos;
        }
    }
    next();
};
