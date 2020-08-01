import mongoose from 'mongoose';
import _ from 'lodash';
import { dofusInfosType, dragodindeType, userStatic } from '../@types/models/dofus_infos';

const Schema = mongoose.Schema;

const dofusInfosSchema = new Schema({
    userId: String,
    notes: [{
        title: String,
        content: String
    }],
    dragodindes: [{
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

dofusInfosSchema.statics.get = async (userId: string) => {
    if (userId) {
        const Dofus = mongoose.model<dofusInfosType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) {
            return allDofusInfos;
        }
    }
    return false;
};

dofusInfosSchema.statics.getAllDragodindesNotifInfos = async () => {
    const Dofus = mongoose.model<dofusInfosType>('Dofus');
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

dofusInfosSchema.statics.getDragodindes = async (userId: string) => {
    if (userId) {
        const Dofus = mongoose.model<dofusInfosType>('Dofus');
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) {
            return allDofusInfos.dragodindes;
        }
    }
    return false;
};

dofusInfosSchema.statics.createNotificationStatus = async (userId: string, status: string) => {
    if (userId && status) {
        const dofusObj = {
            userId: userId,
            notes: [],
            dragodindes: [],
            notif: status === 'on' ? true : false
        };
        const Dofus = mongoose.model<dofusInfosType>('Dofus');
        await new Dofus(dofusObj).save();
        return dofusObj;
    }
    return false;
};

dofusInfosSchema.statics.addDragodindes = async (allDofusInfos: dofusInfosType, addedDragodindes: dragodindeType[]) => {
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

dofusInfosSchema.statics.createDragodindes = async (userId: string, addedDragodindes: dragodindeType[]) => {
    if (userId && addedDragodindes && addedDragodindes.length) {
        const dofusObj = {
            userId: userId,
            dragodindes: [] as dragodindeType[],
            notes: []
        };
        addedDragodindes.map((drago: dragodindeType) => {
            dofusObj.dragodindes.push(drago);
        });
        const Dofus = mongoose.model<dofusInfosType>('Dofus');
        await new Dofus(dofusObj).save();
        return dofusObj.dragodindes;
    }
    return false;
};

dofusInfosSchema.statics.removeDragodindes = async (allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]) => {
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

dofusInfosSchema.statics.setNotificationsByStatus = async (allDofusInfos: dofusInfosType, status: string) => {
    if (allDofusInfos && status) {
        allDofusInfos.notif = status === 'on' ? true : false;
        allDofusInfos.markModified('notif');
        await allDofusInfos.save();
        return allDofusInfos;
    }
    return false;
};

dofusInfosSchema.statics.modifyLastDragodindes = async (action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]) => {
    if (action && allDofusInfos && dragodindes && dragodindes.length) {
        allDofusInfos.dragodindes.map(drago => {
            if (action === 'update') {
                if (drago.name === dragodindes[0].name) {
                    drago.last = {
                        status: true,
                        date: Date.now()
                    };
                    drago.used = false;
                }
                else {
                    drago.last = {
                        status: false
                    };
                }
            }
            else if (action === 'remove') {
                if (drago.name === dragodindes[0].name) {
                    drago.last = {
                        status: false
                    };
                }
            }
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusInfosSchema.statics.modifyUsedDragodindes = async (action: string, allDofusInfos: dofusInfosType, dragodindes: dragodindeType[]) => {
    if (action && allDofusInfos && dragodindes && dragodindes.length) {
        allDofusInfos.dragodindes.map(drago => {
            if (_.findIndex(dragodindes, (o: dragodindeType) => drago.name === o.name) !== -1) {
                if (action === 'update') {
                    drago.used = true;
                    drago.last = {
                        status: false
                    };
                }
                else if (action === 'remove') {
                    drago.used = false;
                }
            }
        });
        allDofusInfos.markModified('dragodindes');
        await allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusInfosSchema.statics.addNotes = async (allDofusInfos: dofusInfosType, title: string, content: string) => {
    if (allDofusInfos && title && content) {
        allDofusInfos.notes.push({ title: title, content: content });
        allDofusInfos.markModified('notes');
        await allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

dofusInfosSchema.statics.createNotes = async (userId: string, title: string, content: string) => {
    if (userId && title && content) {
        const dofusObj = {
            userId: userId,
            dragodindes: [],
            notes: [{
                title: title,
                content: content
            }]
        };
        const Dofus = mongoose.model<dofusInfosType>('Dofus');
        await new Dofus(dofusObj).save();
        return dofusObj.notes;
    }
    return false;
};

dofusInfosSchema.statics.updateNotes = async (allDofusInfos: dofusInfosType, title: string, oldContent: string, newContent: string) => {
    if (allDofusInfos && title && oldContent && newContent) {
        allDofusInfos.notes.map(note => {
            if (note.title === title && note.content === oldContent) {
                note.content = newContent;
            }
        });
        allDofusInfos.markModified('notes');
        await allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

dofusInfosSchema.statics.removeNotes = async (allDofusInfos: dofusInfosType, title: string, content: string) => {
    if (allDofusInfos && title && content) {
        allDofusInfos.notes.map((n, index) => {
            if (n.title === title && n.content === content) {
                delete allDofusInfos.notes[index];
            }
        });
        allDofusInfos.notes = _.compact(allDofusInfos.notes);
        allDofusInfos.markModified('notes');
        await allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

export default mongoose.model<dofusInfosType, userStatic>('Dofus', dofusInfosSchema);
