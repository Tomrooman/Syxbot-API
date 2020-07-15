import mongoose from 'mongoose';
import _ from 'lodash';

const Schema = mongoose.Schema;

const dofusSchema = new Schema({
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
        }
    }]
}, {
    versionKey: false
});

dofusSchema.statics.get = async (userId) => {
    if (userId) {
        const Dofus = mongoose.model('Dofus', dofusSchema);
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) {
            return allDofusInfos;
        }
    }
    return false;
};

dofusSchema.statics.getDragodindes = async (userId) => {
    if (userId) {
        const Dofus = mongoose.model('Dofus', dofusSchema);
        const allDofusInfos = await Dofus.findOne({
            userId: userId
        });
        if (allDofusInfos) {
            return allDofusInfos.dragodindes;
        }
    }
    return false;
};

dofusSchema.statics.addDragodindes = async (allDofusInfos, addedDragodindes) => {
    if (allDofusInfos && addedDragodindes && addedDragodindes.length) {
        addedDragodindes.map(drago => {
            allDofusInfos.dragodindes.push(drago);
        });
        allDofusInfos.markModified('dragodindes');
        allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.createDragodindes = async (userId, addedDragodindes) => {
    if (userId && addedDragodindes && addedDragodindes.length) {
        const dofusObj = {
            userId: userId,
            dragodindes: []
        };
        addedDragodindes.map(drago => {
            dofusObj.dragodindes.push(drago);
        });
        new dofusSchema(dofusObj).save();
        return dofusObj.dragodindes;
    }
    return false;
};

dofusSchema.statics.removeDragodindes = async (allDofusInfos, dragodindes) => {
    if (allDofusInfos && dragodindes && dragodindes.length) {
        dragodindes.map(drago => {
            const index = _.findIndex(allDofusInfos.dragodindes, o => drago.name === o.name);
            if (index !== -1) {
                delete allDofusInfos.dragodindes[index];
                allDofusInfos.dragodindes = _.compact(allDofusInfos.dragodindes);
            }
        });
        allDofusInfos.markModified('dragodindes');
        allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.modifyLastDragodindes = async (action, allDofusInfos, dragodindes) => {
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
        allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.modifyUsedDragodindes = async (action, allDofusInfos, dragodindes) => {
    if (action && allDofusInfos && dragodindes && dragodindes.length) {
        allDofusInfos.dragodindes.map(drago => {
            if (_.findIndex(dragodindes, o => drago.name === o.name) !== -1) {
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
        allDofusInfos.save();
        return allDofusInfos.dragodindes;
    }
    return false;
};

dofusSchema.statics.addNotes = async (allDofusInfos, title, content) => {
    if (allDofusInfos && title && content) {
        allDofusInfos.notes.push({ title: title, content: content });
        allDofusInfos.markModified('notes');
        allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

dofusSchema.statics.createNotes = async (userId, title, content) => {
    if (userId && title && content) {
        const dofusObj = {
            userId: userId,
            notes: [{
                title: title,
                content: content
            }]
        };
        new dofusSchema(dofusObj).save();
        return dofusObj.notes;
    }
    return false;
};

dofusSchema.statics.updateNotes = async (allDofusInfos, title, oldContent, newContent) => {
    if (allDofusInfos && title && oldContent && newContent) {
        allDofusInfos.notes.map(note => {
            if (note.title === title && note.content === oldContent) {
                note.content = newContent;
            }
        });
        allDofusInfos.markModified('notes');
        allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

dofusSchema.statics.removeNotes = async (allDofusInfos, title, content) => {
    if (allDofusInfos && title && content) {
        allDofusInfos.notes.map((n, index) => {
            if (n.title === title && n.content === content) {
                delete allDofusInfos.notes[index];
            }
        });
        allDofusInfos.notes = _.compact(allDofusInfos.notes);
        allDofusInfos.markModified('notes');
        allDofusInfos.save();
        return allDofusInfos.notes;
    }
    return false;
};

export default mongoose.model('Dofus', dofusSchema);