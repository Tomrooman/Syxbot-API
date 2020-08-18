import { Document, Model } from 'mongoose';

export interface dofusInfosType extends Document {
    userId: string;
    enclos: enclosType[];
    dragodindes: dragodindeType[];
    notif: boolean;
};

export interface enclosType {
    title: string;
    content: string;
};

export interface dataObjType {
    baseDate: number;
    ddFecond: dragodindeType | {};
    sortedDragodindes: dragodindeType[];
    timeDiff: {
        hours: number;
        min: number;
        sec: number;
    };
};

export interface notifArrayType {
    userId: string;
    dragodindes: dragodindesType[] | sortedDragoType[];
};

export interface userNotifInfos {
    userId: string;
    notif: boolean;
};

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
};

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
};

export interface userStatic extends Model<dofusInfosType> {
    get(userId: string): Promise<dofusInfosType> | false;

    getNotifications(): Promise<notifArrayType[]> | false;

    setDragodindesToSended(notifArray: notifArrayType[]): Promise<boolean>;

    getAllDragodindesNotifInfos(): Promise<dofusInfosType[]> | false;

    getDragodindes(userId: string): Promise<dragodindeType[]> | false;

    createNotificationStatus(userId: string, status: string): Promise<dofusInfosType> | false;

    addDragodindes(allDofusInfos: dofusInfosType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    createDragodindes(userId: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    removeDragodindes(allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    setNotificationsByStatus(allDofusInfos: dofusInfosType, status: string): Promise<dofusInfosType> | false;

    automateStatus(allDofusInfos: dofusInfosType, dragodindes: { last: dragodindeType[], used: dragodindeType[] }): Promise<dragodindeType[]> | false;

    modifyLastDragodindes(action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    modifyUsedDragodindes(action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    addEnclos(allDofusInfos: dofusInfosType, title: string, content: string): Promise<enclosType[]> | false;

    createEnclos(userId: string, title: string, content: string): Promise<enclosType[]> | false;

    updateEnclos(allDofusInfos: dofusInfosType, title: string, oldContent: string, newContent: string): Promise<enclosType[]> | false;

    removeEnclos(allDofusInfos: dofusInfosType, title: string, content: string): Promise<enclosType[]> | false;
};
