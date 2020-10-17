'use strict';

import dofusInfosModel from '../../models/dofus_infos';
import { enclosType } from '../../@types/models/dofus_infos';
import { Request, Response, NextFunction } from 'express';

export const getEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) res.enclos = allDofusInfos.enclos;
    }
    next();
};

export const createOrAddEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        let enclos: enclosType[] | false = false;
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) enclos = await dofusInfosModel.addEnclos(allDofusInfos, req.body.title, req.body.content);
        else enclos = await dofusInfosModel.createEnclos(req.body.userId, req.body.title, req.body.content);
        res.enclos = enclos;
    }
    next();
};

export const updateEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.oldContent && req.body.newContent) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const title = req.body.title;
            const oldContent = req.body.oldContent;
            const newContent = req.body.newContent;
            const enclos = await dofusInfosModel.updateEnclos(allDofusInfos, title, oldContent, newContent);
            res.enclos = enclos;
        }
    }
    next();
};

export const removeEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.title && req.body.content) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const enclos = await dofusInfosModel.removeEnclos(allDofusInfos, req.body.title, req.body.content);
            res.enclos = enclos;
        }
    }
    next();
};
