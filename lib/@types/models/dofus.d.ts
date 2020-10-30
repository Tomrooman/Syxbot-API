import mongoose, { Document, Model } from 'mongoose';

export interface dofusType extends Document {
    userID: string;
    enclos: enclosType[];
    dragodindes: dragodindeType[];
    notif: boolean;
}

export interface findAndUpdateID {
    userID: string;
    enclosID?: string;
}

export interface enclosType {
    _id?: string;
    title: string;
    content: string;
}

export interface modifyEnclosType {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
}

export interface dataObjType {
    baseDate: number;
    ddFecond: dragodindeType | Partial<dragodindeType>;
    sortedDragodindes: dragodindeType[];
    timeDiff: {
        hours: number;
        min: number;
        sec: number;
    };
}

export interface notifArrayType {
    userID: string;
    dragodindes: dragodindesType[] | sortedDragoType[];
}

export interface userNotifInfos {
    userID: string;
    notif: boolean;
}

export interface dragodindeType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    last: {
        status: boolean;
        date?: number;
    };
    sended: boolean;
}

export interface sortedDragoType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    selected?: boolean;
    last: {
        status: boolean;
        date?: number;
    };
    end: {
        time: string;
        date: number;
    };
    sended: boolean;
}

/* eslint-disable max-len */
export interface userStatic extends Model<dofusType> {
    get(userID: string): Promise<dofusType> | false;

    getDragodindesIfFecondExist(): Promise<notifArrayType[]> | false;

    setDragodindesToSended(notifArray: notifArrayType[]): Promise<boolean>;

    getAllDragodindesNotifInfos(): Promise<dofusType[]> | false;

    getDragodindes(userID: string): Promise<dragodindeType[]> | false;

    createNotificationStatus(userID: string, status: string): Promise<dofusType> | false;

    addDragodindes(allDofusInfos: dofusType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    createDragodindes(userID: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    removeDragodindes(allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    setNotificationsByStatus(allDofusInfos: dofusType, status: string): Promise<dofusType> | false;

    automaticStatus(allDofusInfos: dofusType, dragodindes: { last: dragodindeType[], used: dragodindeType[] }): Promise<dragodindeType[]> | false;

    modifyLastDragodindes(action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    modifyUsedDragodindes(action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    findAndUpdateEnclos(ObjID: findAndUpdateID, title: string, content: string): Promise<enclosType[]> | false;
}
