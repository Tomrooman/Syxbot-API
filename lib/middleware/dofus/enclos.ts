'use strict';

import dofusModel from '../../models/dofus';
import { enclosType } from '../../@types/models/dofus';
import { Request, Response, NextFunction } from 'express';

export const getEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const allDofusInfos = await dofusModel.get(req.body.userID);
    if (allDofusInfos) res.enclos = allDofusInfos.enclos;
    res.status(200);
    next();
};

export const modifyEnclos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.content && (req.body.enclosID || req.body.title)) {
        let enclos: enclosType[] | false = false;
        const ObjID = req.body.enclosID ?
            { userID: req.body.userID, enclosID: req.body.enclosID } :
            { userID: req.body.userID };
        enclos = await dofusModel.findAndUpdateEnclos(ObjID, req.body.title, req.body.content);
        res.enclos = enclos;
        res.status(201);
    }
    else if (req.body.enclosID && !req.body.content && !req.body.title && req.body.action === 'remove') {
        const ObjID = { userID: req.body.userID, enclosID: req.body.enclosID };
        const enclos = await dofusModel.findAndUpdateEnclos(ObjID, '', '');
        res.enclos = enclos;
        res.status(201);
    }
    else res.status(400);
    next();
};
