'use strict';

import dofusInfosModel from '../../models/dofus_infos';
import { dofusInfosType, dragodindeType } from '../../@types/models/dofus_infos';
import _ from 'lodash';
import { sortedDragoType } from '../../@types/models/dofus_infos';
import { Request, Response, NextFunction } from 'express';

export const getAllDragodindesNotifInfos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dragodindesNotif = await dofusInfosModel.getAllDragodindesNotifInfos();
    if (dragodindesNotif) {
        res.dragodindesNotif = dragodindesNotif;
    }
    next();
};

export const getDofusInfos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            res.allDofusInfos = allDofusInfos;
        }
    }
    next();
};

export const getDragodindes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId) {
        const dragodindes = await dofusInfosModel.getDragodindes(req.body.userId);
        if (dragodindes) {
            res.dragodindes = dragodindes;
        }
    }
    next();
};

export const calculateTime = (_req: Request, res: Response, next: NextFunction): void => {
    if (res.dragodindes) {
        const now = Date.now();
        let ddFecond: dragodindeType | undefined = _.find(res.dragodindes, (drago: dragodindeType) => drago.last.status);
        const baseDate = ddFecond ? Number((ddFecond as dragodindeType).last.date) : now;
        const filteredDrago = (res.dragodindes as dragodindeType[]).filter((d) => !d.last.status && !d.used);
        const sortedDragodindes = filteredDrago.length ? _.reverse(_.sortBy(filteredDrago, 'duration', 'asc')) : [];
        const hoursDiff = ddFecond ? Math.floor((now - baseDate) / (1000 * 60 * 60)) : 0;
        let minDiff = ddFecond ? Math.floor((now - baseDate) / (1000 * 60)) : 0;
        minDiff = ddFecond ? minDiff - (Math.floor(minDiff / 60) * 60) : 0;
        minDiff = 60 - minDiff;
        let secondDiff = ddFecond ? Math.floor((now - baseDate) / 1000) : 0;
        secondDiff = ddFecond ? secondDiff - Math.floor(secondDiff / 60) * 60 : 0;
        secondDiff = 60 - secondDiff;
        res.baseDate = baseDate;
        res.ddFecond = ddFecond;
        res.sortedDragodindes = sortedDragodindes;
        res.timeDiff = {
            hours: hoursDiff,
            min: minDiff,
            sec: secondDiff
        }
    }
    next();
};

export const makeDragodindesEndParams = (_req: Request, res: Response, next: NextFunction): void => {
    if (res.dragodindes && res.baseDate && res.ddFecond && res.sortedDragodindes && res.timeDiff) {
        let estimatedTime = 0;
        let prevDrago: sortedDragoType = {} as sortedDragoType;
        let isEnded = false;
        const { sortedDragodindes, ddFecond, timeDiff } = res;
        let { baseDate } = res;
        const goodDragodindes: sortedDragoType[] = [];
        sortedDragodindes.map((drago: dragodindeType, index: number) => {
            let goodTime = '';
            let goodDate = 0;
            if ((Object.keys(prevDrago).length && prevDrago.end.time.substr(0, 10) === 'Maintenant') || isEnded) {
                estimatedTime += prevDrago.duration - drago.duration;
                goodTime = estimatedTime === 0 ? 'Maintenant' : estimatedTime + 'H';
                goodDate = Date.now() + (estimatedTime * 60 * 60 * 1000);
                isEnded = true;
            } else if (Object.keys(ddFecond).length && index === 0 && ddFecond.duration !== drago.duration && timeDiff.hours < ddFecond.duration - drago.duration) {
                estimatedTime += ddFecond.duration - drago.duration;
                const showedTime = setTimeRemaining(estimatedTime, timeDiff.hours, timeDiff.min, timeDiff.sec);
                goodDate = baseDate + ((ddFecond.duration - drago.duration) * 60 * 60 * 1000);
                goodTime = showedTime;
            } else if ((!Object.keys(ddFecond).length && !prevDrago && index === 0) || (Object.keys(ddFecond).length && ddFecond.duration === drago.duration) || (Object.keys(ddFecond).length && timeDiff.hours >= ddFecond.duration - drago.duration)) {
                goodTime = 'Maintenant';
                goodDate = Object.keys(ddFecond).length && timeDiff.hours >= ddFecond.duration - drago.duration ? baseDate + (timeDiff.hours * 1000 * 60 * 60) : baseDate;
                baseDate = Object.keys(ddFecond).length && timeDiff.hours >= ddFecond.duration - drago.duration ? baseDate + (timeDiff.hours * 60 * 60 * 1000) : baseDate;
            } else {
                if (Object.keys(prevDrago).length && prevDrago.duration !== drago.duration) {
                    estimatedTime += prevDrago.duration - drago.duration;
                }
                const showedTime = setTimeRemaining(estimatedTime, timeDiff.hours, timeDiff.min, timeDiff.sec);
                goodTime = estimatedTime === 0 ? 'Maintenant' : showedTime;
                goodDate = baseDate + (estimatedTime * 60 * 60 * 1000);
            }
            const newDragoObj = setDragoObject(drago, goodDate, goodTime);
            goodDragodindes.push(newDragoObj);
            prevDrago = newDragoObj;
        });
        res.fecondator = goodDragodindes;
    }
    next();
};

const setDragoObject = (drago: dragodindeType, goodDate: number, goodTime: string): sortedDragoType => {
    let lastObj: { status: boolean, date?: number } = {
        status: drago.last.status
    };
    if (drago.last.status) {
        lastObj.date = drago.last.date;
    }
    return {
        name: drago.name,
        duration: drago.duration,
        generation: drago.generation,
        last: lastObj,
        used: drago.used,
        end: {
            time: goodTime,
            date: goodDate
        }
    };
};

const setTimeRemaining = (duration: number, hours: number, minutes: number, seconds: number): string => {
    let goodHours: string | number = duration - hours;
    let returnedStr = '';
    goodHours = minutes > 0 || seconds > 0 ? goodHours - 1 : goodHours;
    minutes = seconds > 0 ? minutes - 1 : minutes;
    if (seconds === 60) {
        minutes += 1;
    } else if (minutes > 0 && seconds === 0) {
        minutes -= 1;
    }
    const stringMinutes = (minutes > 0 && minutes < 10 ? '0' + minutes + 'M' : minutes + 'M');
    const stringSeconds = (seconds > 0 && seconds < 10 ? '0' + seconds + 'S' : seconds + 'S');
    if (seconds !== 60 && minutes !== 60) {
        returnedStr = goodHours > 0 ? goodHours + 'H' + stringMinutes + stringSeconds : stringMinutes + stringSeconds;
    } else if (seconds === 60 && minutes === 60) {
        goodHours = goodHours <= 0 ? '1H' : goodHours + 1;
        returnedStr = goodHours === '1H' ? goodHours : goodHours + 'H';
    } else if (seconds === 60 && minutes !== 60) {
        returnedStr = goodHours <= 0 ? stringMinutes + '00S' : goodHours + 'H' + stringMinutes + '00S';
    }
    return returnedStr;
};

export const SetNotificationsByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let status: dofusInfosType | false = false;
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

export const CreateOrAddDragodindes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.dragodindes) {
        let dragodindes: dragodindeType[] | false = false;
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            dragodindes = await dofusInfosModel.addDragodindes(allDofusInfos, req.body.dragodindes);
        } else {
            dragodindes = await dofusInfosModel.createDragodindes(req.body.userId, req.body.dragodindes);
        }
        res.dragodindes = dragodindes;
    }
    next();
};

export const modifyDragodindesStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.dragodindes && req.params.action && req.params.type) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos && req.body.dragodindes.length >= 1) {
            let dragodindes: dragodindeType[] | false = false;
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

export const removeDragodindes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.userId && req.body.dragodindes) {
        const allDofusInfos = await dofusInfosModel.get(req.body.userId);
        if (allDofusInfos) {
            const dragodindes = await dofusInfosModel.removeDragodindes(allDofusInfos, req.body.dragodindes);
            res.dragodindes = dragodindes;
        }
    }
    next();
};
