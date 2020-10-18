import { Document, Model } from 'mongoose';

export interface dofusType extends Document {
    userId: string;
    enclos: enclosType[];
    dragodindes: dragodindeType[];
    notif: boolean;
}

export interface enclosType {
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
    userId: string;
    dragodindes: dragodindesType[] | sortedDragoType[];
}

export interface userNotifInfos {
    userId: string;
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
    get(userId: string): Promise<dofusType> | false;

    getNotifications(): Promise<notifArrayType[]> | false;

    setDragodindesToSended(notifArray: notifArrayType[]): Promise<boolean>;

    getAllDragodindesNotifInfos(): Promise<dofusType[]> | false;

    getDragodindes(userId: string): Promise<dragodindeType[]> | false;

    createNotificationStatus(userId: string, status: string): Promise<dofusType> | false;

    addDragodindes(allDofusInfos: dofusType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    createDragodindes(userId: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    removeDragodindes(allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    setNotificationsByStatus(allDofusInfos: dofusType, status: string): Promise<dofusType> | false;

    automateStatus(allDofusInfos: dofusType, dragodindes: { last: dragodindeType[], used: dragodindeType[] }): Promise<dragodindeType[]> | false;

    modifyLastDragodindes(action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    modifyUsedDragodindes(action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    addEnclos(allDofusInfos: dofusType, title: string, content: string): Promise<enclosType[]> | false;

    createEnclos(userId: string, title: string, content: string): Promise<enclosType[]> | false;

    updateEnclos(allDofusInfos: dofusType, title: string, oldContent: string, newContent: string): Promise<enclosType[]> | false;

    removeEnclos(allDofusInfos: dofusType, title: string, content: string): Promise<enclosType[]> | false;
}
