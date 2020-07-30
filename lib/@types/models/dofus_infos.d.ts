import { Document, Model } from 'mongoose';

export interface dofusInfosType extends Document {
    userId: String;
    notes?: noteType[];
    dragodindes?: dragodindeType[];
    notif: boolean;
}

export interface noteType {
    title: string;
    content: string;
}

export interface dragodindeType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    last: {
        status: boolean;
        date: Date;
    };
}

export interface sortedDragoType {
    name: string;
    duration: number;
    generation: number;
    used: boolean;
    selected?: boolean;
    last: {
        status: boolean;
        date?: string;
    };
    end: {
        time: string;
        date: string;
    };
};

export interface userStatic extends Model<dofusInfosType> {
    get(userId: string): Promise<dofusInfosType> | false;

    getAllDragodindesNotifInfos(): Promise<dofusInfosType[]> | false;

    getDragodindes(userId: string): Promise<dragodindeType[]> | false;

    createNotificationStatus(userId: string, status: string): Promise<dofusInfosType> | false;

    addDragodindes(allDofusInfos: dofusInfosType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    createDragodindes(userId: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    removeDragodindes(allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    setNotificationsByStatus(allDofusInfos: dofusInfosType, status: string): Promise<dofusInfosType> | false;

    modifyLastDragodindes(action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    modifyUsedDragodindes(action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]): Promise<dragodindeType[]> | false;

    addNotes(allDofusInfos: dofusInfosType, title: string, content: string): Promise<noteType[]> | false;

    createNotes(userId: string, title: string, content: string): Promise<noteType[]> | false;

    updateNotes(allDofusInfos: dofusInfosType, title: string, oldContent: string, newContent: string): Promise<noteType[]> | false;

    removeNotes(allDofusInfos: dofusInfosType, title: string, content: string): Promise<noteType[]> | false;
}