import mongoose from 'mongoose';
import _ from 'lodash';
import {
    dofusType, dragodindeType, userStatic, enclosType,
    notifArrayType, userNotifInfos, sortedDragoType, findAndUpdateID,
    modifyEnclosType
} from '../@types/models/dofus';

const Schema = mongoose.Schema;

const dofusSchema = new Schema({
    userID: {
        type: String,
        require: true,
        unique: true
    },
    enclos: [{
        _id: {
            type: mongoose.Types.ObjectId,
            default: mongoose.Types.ObjectId(),
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

dofusSchema.statics.get = async (userID: string): Promise<dofusType | false> => {
    if (userID) {
        const Dofus = mongoose.model<dofusType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userID: userID
        }).lean();
        if (allDofusInfos) return allDofusInfos as dofusType;
    }
    return false;
};

dofusSchema.statics.getDragodindesIfFecondExist = async (): Promise<notifArrayType[] | false> => {
    const Dofus = mongoose.model<dofusType>('Dofus');
    const allDofusInfos = await Dofus.find({
        notif: true
    }).lean() as dofusType[];
    if (allDofusInfos) {
        const dragodindes: notifArrayType[] = [];
        allDofusInfos.map((infos: dofusType) => {
            if (infos.dragodindes.length) {
                if (_.find(infos.dragodindes, drago => drago.last.status)) {
                    dragodindes.push({
                        userID: infos.userID,
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
    const allDofusInfos = await Dofus.find({
        notif: true
    }).lean();
    if (allDofusInfos && allDofusInfos.length) {
        const dofusNotif = allDofusInfos.map(dofusInfos => {
            return {
                userID: dofusInfos.userID,
                notif: dofusInfos.notif
            };
        });
        return dofusNotif;
    }
    return false;
};

dofusSchema.statics.getDragodindes = async (userID: string): Promise<dragodindeType[] | false> => {
    if (userID) {
        const Dofus = mongoose.model<dofusType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userID: userID
        }).lean();
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
                    let allDofusInfos = await Dofus.get(array.userID);
                    if (allDofusInfos) {
                        allDofusInfos.dragodindes.map(drago => {
                            if (dragoName.includes(drago.name)) drago.sended = true;
                        });
                        allDofusInfos = Dofus.hydrate(allDofusInfos);
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

dofusSchema.statics.createNotificationStatus = async (userID: string, status: string): Promise<dofusType | false> => {
    if (userID && status) {
        const dofusObj = {
            userID: userID,
            enclos: [],
            dragodindes: [],
            notif: status === 'on' ? true : false
        };
        const Dofus = mongoose.model<dofusType>('Dofus');
        const dofusSaved = await new Dofus(dofusObj).save();
        return dofusSaved.toObject();
    }
    return false;
};

dofusSchema.statics.addDragodindes = async (allDofusInfos: dofusType, addedDragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && Object.keys(allDofusInfos).length && addedDragodindes && addedDragodindes.length) {
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        addedDragodindes.map(drago => {
            allDofusInfos.dragodindes.push(drago);
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.createDragodindes = async (userID: string, addedDragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (userID && addedDragodindes && addedDragodindes.length) {
        const dofusObj = {
            userID: userID,
            dragodindes: addedDragodindes,
            enclos: []
        };
        const Dofus = mongoose.model<dofusType>('Dofus');
        const dofusSaved = await new Dofus(dofusObj).save();
        return dofusSaved.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.removeDragodindes = async (allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && Object.keys(allDofusInfos).length && dragodindes && dragodindes.length) {
        dragodindes.map(drago => {
            const index = _.findIndex(allDofusInfos.dragodindes, (o: dragodindeType) => drago.name === o.name);
            if (index !== -1) {
                delete allDofusInfos.dragodindes[index];
                allDofusInfos.dragodindes = _.compact(allDofusInfos.dragodindes);
            }

        });
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.setNotificationsByStatus = async (allDofusInfos: dofusType, status: string): Promise<dofusType | false> => {
    if (allDofusInfos && Object.keys(allDofusInfos).length && status) {
        allDofusInfos.notif = status === 'on' ? true : false;
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        allDofusInfos.markModified('notif');
        await allDofusInfos.save();
        return allDofusInfos.toObject();
    }
    return false;
};

dofusSchema.statics.modifyLastDragodindes = async (action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (action && allDofusInfos && Object.keys(allDofusInfos).length &&
        dragodindes && dragodindes.length) {
        if (_.findIndex(allDofusInfos.dragodindes, { name: dragodindes[0].name }) === -1) return false;
        allDofusInfos.dragodindes.map(drago => {
            if (drago.name === dragodindes[0].name) {
                if (action === 'update') {
                    drago.last = {
                        status: true,
                        date: Date.now()
                    };
                    drago.used = false;
                    drago.sended = true;
                }
                else if (action === 'remove') {
                    drago.last = {
                        status: false
                    };
                    drago.used = false;
                    drago.sended = false;
                }
            }
            else if (action === 'update' && drago.last.status) {
                drago.last = { status: false };
                drago.sended = false;
            }
        });
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.automaticStatus = async (allDofusInfos: dofusType, dragodindes: { last: dragodindeType[], used: dragodindeType[] }): Promise<dragodindeType[] | false> => {
    if (allDofusInfos && Object.keys(allDofusInfos).length && dragodindes &&
        (dragodindes.last.length || dragodindes.used.length)) {
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
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.modifyUsedDragodindes = async (action: string, allDofusInfos: dofusType, dragodindes: dragodindeType[]): Promise<dragodindeType[] | false> => {
    if (action && allDofusInfos && Object.keys(allDofusInfos).length &&
        dragodindes && dragodindes.length) {
        if (_.findIndex(allDofusInfos.dragodindes, { name: dragodindes[0].name }) === -1) return false;
        allDofusInfos.dragodindes.map(drago => {
            if (drago.name === dragodindes[0].name) {
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
        allDofusInfos = mongoose.model<dofusType>('Dofus').hydrate(allDofusInfos);
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.toObject().dragodindes;
    }
    return false;
};

dofusSchema.statics.findAndUpdateEnclos = async (ObjID: findAndUpdateID, title: string, content: string): Promise<enclosType[] | false> => {
    const Dofus = mongoose.model<dofusType>('Dofus');
    if (ObjID.userID && content &&
        (ObjID.enclosID && mongoose.Types.ObjectId.isValid(ObjID.enclosID) || title)) {
        const enclosData = { title, content } as modifyEnclosType;
        const query = { userID: ObjID.userID };
        const update = ObjID.enclosID ?
            { $set: { 'enclos.$[elem]': { title, content } } } :
            { $push: { enclos: enclosData } };
        const options = ObjID.enclosID ?
            { new: true, arrayFilters: [{ 'elem._id': ObjID.enclosID }] } :
            { new: true, upsert: true, setDefaultsOnInsert: true };
        const result = await Dofus.findOneAndUpdate(query, update, options).lean() as dofusType;
        return result.enclos;
    }
    else if (ObjID.userID && ObjID.enclosID && mongoose.Types.ObjectId.isValid(ObjID.enclosID)
        && !content.length && !title.length) {
        const result = await Dofus.findOneAndUpdate(
            { userID: ObjID.userID },
            { $pull: { enclos: { _id: ObjID.enclosID } } },
            { new: true }
        ).lean() as dofusType;
        return result.enclos;
    }
    return false;
};

export default mongoose.model<dofusType, userStatic>('Dofus', dofusSchema);
