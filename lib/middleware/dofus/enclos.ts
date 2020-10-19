'use strict';

import dofusModel from '../../models/dofus';
import { enclosType } from '../../@types/models/dofus';
import { Request, Response, NextFunction } from 'express';

export const getEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const allDofusInfos = await dofusModel.get(req.body.userId);
    if (allDofusInfos) res.enclos = allDofusInfos.enclos;
    res.status(200);
    next();
};

export const createOrAddEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.title && req.body.content) {
        let enclos: enclosType[] | false = false;
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) enclos = await dofusModel.addEnclos(allDofusInfos, req.body.title, req.body.content);
        else enclos = await dofusModel.createEnclos(req.body.userId, req.body.title, req.body.content);
        res.enclos = enclos;
        res.status(201);
    }
    else res.status(400);
    next();
};

export const updateEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.id && req.body.content) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const content = req.body.content;
            const id = req.body.id;
            const enclos = await dofusModel.updateEnclos(allDofusInfos, id, content);
            res.enclos = enclos;
            res.status(200);
        }
        else res.status(500);
    }
    else res.status(400);
    next();
};

export const removeEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.id) {
        const allDofusInfos = await dofusModel.get(req.body.userId);
        if (allDofusInfos) {
            const enclos = await dofusModel.removeEnclos(allDofusInfos, req.body.id);
            res.enclos = enclos;
            res.status(200);
        }
        else res.status(500);
    }
    else res.status(400);
    next();
};
