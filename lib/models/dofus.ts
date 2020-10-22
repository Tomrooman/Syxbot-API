import mongoose from 'mongoose';
import _ from 'lodash';
import {
    dofusType, dragodindeType, userStatic, enclosType,
    notifArrayType, userNotifInfos, sortedDragoType
} from '../@types/models/dofus';

const Schema = mongoose.Schema;

const dofusSchema = new Schema({
    userId: String,
    enclos: [{
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
            auto: true
        },
        title: String,
        content: String
    }],
    dragodindes: [{
        _id: false,
        name: String,
        duration: Number,
        generation: Number,
        used: { type: Boolean, default: false },
        last: {
            status: { type: Boolean, default: false },
            date: Date
        },
        sended: { type: Boolean, default: false }
    }],
    notif: { type: Boolean, default: false }
}, {
    versionKey: false
});

dofusSchema.statics.get = async (userId: string): Promise<dofusType | false> => {
    if (userId) {
        const Dofus = mongoose.model<dofusType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) return allDofusInfos;
    }
    return false;
};

dofusSchema.statics.getDragodindesIfFecondExist = async (): Promise<notifArrayType[] | false> => {
    const Dofus = mongoose.model<dofusType>('Dofus');
    const allDofusInfos = await Dofus.find({
        notif: true
    });
    if (allDofusInfos) {
        const dragodindes: notifArrayType[] = [];
        allDofusInfos.map((infos: dofusType) => {
            if (infos.dragodindes.length) {
                if (_.find(infos.dragodindes, drago => drago.last.status)) {
                    dragodindes.push({
                        userId: infos.userId,
                        dragodindes: infos.dragodindes
                    });
                }
            }
        });
        return dragodindes.length ? dragodindes : false;
    }
    return false;
};

dofusSchema.statics.getAllDragodindesNotifInfos = async (): Promise<userNotifInfos[] | false> => {
    const Dofus = mongoose.model<dofusType>('Dofus');
    const allDofusInfos = await Dofus.find();
    if (allDofusInfos) {
        const dofusNotif = allDofusInfos.map(dofusInfos => {
            return {
                userId: dofusInfos.userId,
                notif: dofusInfos.notif
            };
        });
        return dofusNotif;
    }
    return false;
};

dofusSchema.statics.getDragodindes = async (userId: string): Promise<dragodindeType[] | false> => {
    if (userId) {
        const Dofus = mongoose.model<dofusType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.setDragodindesToSended = async (notifArray: notifArrayType[]): Promise<boolean> => {
    if (notifArray && notifArray.length) {
        const Dofus = mongoose.model<dofusType, userStatic>('Dofus');
        try {
            notifArray.map(async (array: notifArrayType) => {
                const dragoName = (array.dragodindes as sortedDragoType[]).map((drago: sortedDragoType) => {
                    if (drago.end.time === 'Maintenant') return drago.name;
                });
                if (dragoName && dragoName.length) {
                    const allDofusInfos = await Dofus.get(array.userId);
                    if (allDofusInfos) {
                        allDofusInfos.dragodindes.map(drago => {
                            if (dragoName.includes(drago.name)) {
                                drago.sended = true
                            };
                        });
                        allDofusInfos.markModified('dragodindes');
                        await allDofusInfos.save();
                    }
                }
            });
            return true;
        }
        catch (e) {
            console.log('Error while sending dragodindes.sended modifications : ', e.message);
            return false;
        }
    }
    return false;
};

dofusSchema.statics.createNotificationStatus = async (userId: string, status: string): Promise<dofusType | false> => {
    if (userId && status) {
        const dofusObj = {
            userId: userId,
            enclos: [],
            dragodindes: [],
            notif: status === 'on' ? true : false
        };
        const Dofus = mongoose.model<dofusType>('Dofus');
        const dofusSaved = await new Dofus(dofusObj).save();
        return dofusSaved;
    }
    return false;
};

dofusSchema.statics.addDragodindes = async (allDofusInfos: dofusType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && addedDragodindes && addedDragodindes.length) {
        addedDragodindes.map(drago => {
            allDofusInfos.dragodindes.push(drago);
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.createDragodindes = async (userId: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (userId && addedDragodindes && addedDragodindes.length) {
        const dofusObj = {
            userId: userId,
            dragodindes: [] as dragodindeType[],
            enclos: []
        };
        addedDragodindes.map((drago: dragodindeType) => {
            dofusObj.dragodindes.push(drago);
        });
        const Dofus = mongoose.model<dofusType>('Dofus');
        const dofusSaved = await new Dofus(dofusObj).save();
        return dofusSaved.dragodindes;
    }
    return false;
};

dofusSchema.statics.removeDragodindes = async (allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && dragodindes && dragodindes.length) {
        dragodindes.map(drago => {
            const index = _.findIndex(allDofusInfos.dragodindes, (o: dragodindeType) => drago.name === o.name);
            if (index !== -1) {
                delete allDofusInfos.dragodindes[index];
                allDofusInfos.dragodindes = _.compact(allDofusInfos.dragodindes);
            }

        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.setNotificationsByStatus = async (allDofusInfos: dofusType, status: string): Promise<dofusType | false> => {
    if (allDofusInfos && status) {
        allDofusInfos.notif = status === 'on' ? true : false;
        allDofusInfos.markModified('notif');
        await allDofusInfos.save();
        return allDofusInfos;
    }
    return false;
};

dofusSchema.statics.modifyLastDragodindes = async (action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (action && allDofusInfos && dragodindes && dragodindes.length) {
        allDofusInfos.dragodindes.map(drago => {
            if (action === 'update') {
                if (drago.name === dragodindes[0].name) {
                    drago.last = {
                        status: true,
                        date: Date.now()
                    };
                    drago.used = false;
                    drago.sended = true;
                }
                else drago.last = { status: false };
            }
            else if (action === 'remove') {
                if (drago.name === dragodindes[0].name) {
                    drago.last = {
                        status: false
                    };
                    drago.used = false;
                    drago.sended = false;
                }
            }
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.automateStatus = async (allDofusInfos: dofusType, dragodindes: { last: dragodindeType[], used: dragodindeType[] }): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && dragodindes) {
        allDofusInfos.dragodindes.map(drago => {
            const isLast = _.find(dragodindes.last, (o: dragodindeType) => drago.name === o.name);
            const isUsed = _.find(dragodindes.used, (o: dragodindeType) => drago.name === o.name);
            if (isLast) {
                drago.last = {
                    status: true,
                    date: Date.now()
                };
                drago.used = false;
                drago.sended = true;
            }
            else if (isUsed) {
                drago.used = true;
                drago.last = {
                    status: false
                };
                drago.sended = true;
            }
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.modifyUsedDragodindes = async (action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (action && allDofusInfos && dragodindes && dragodindes.length) {
        allDofusInfos.dragodindes.map(drago => {
            if (_.findIndex(dragodindes, (o: dragodindeType) => drago.name === o.name) !== -1) {
                if (action === 'update') {
                    drago.used = true;
                    drago.last = {
                        status: false
                    };
                    drago.sended = true;
                }
                else if (action === 'remove') {
                    drago.used = false;
                    drago.sended = false;
                }
            }
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.addEnclos = async (allDofusInfos: dofusType, title: string, content: string): Promise<enclosType[] | false> => {
    if (allDofusInfos && title && content) {
        allDofusInfos.enclos.push({ title: title, content: content });
        allDofusInfos.markModified('enclos');
        await allDofusInfos.save();
        return allDofusInfos.enclos;
    }
    return false;
};

dofusSchema.statics.createEnclos = async (userId: string, title: string, content: string): Promise<enclosType[] | false> => {
    if (userId && title && content) {
        const dofusObj = {
            userId: userId,
            dragodindes: [],
            enclos: [{
                title: title,
                content: content
            }]
        };
        const Dofus = mongoose.model<dofusType>('Dofus');
        const dofusSaved = await new Dofus(dofusObj).save();
        return dofusSaved.enclos;
    }
    return false;
};

dofusSchema.statics.updateEnclos = async (allDofusInfos: dofusType, id: string, content: string): Promise<enclosType[] | false> => {
    if (allDofusInfos && id && content) {
        allDofusInfos.enclos.map(enclo => {
            if (enclo._id?.toString() === id) enclo.content = content;
        });
        allDofusInfos.markModified('enclos');
        await allDofusInfos.save();
        return allDofusInfos.enclos;
    }
    return false;
};

dofusSchema.statics.removeEnclos = async (allDofusInfos: dofusType, id: string): Promise<enclosType[] | false> => {
    if (allDofusInfos && id) {
        allDofusInfos.enclos.map((enclo, index) => {
            if (enclo._id?.toString() === id) delete allDofusInfos.enclos[index];
        });
        allDofusInfos.enclos = _.compact(allDofusInfos.enclos);
        allDofusInfos.markModified('enclos');
        await allDofusInfos.save();
        return allDofusInfos.enclos;
    }
    return false;
};

export default mongoose.model<dofusType, userStatic>('Dofus', dofusSchema);
