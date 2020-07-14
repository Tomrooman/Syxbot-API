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

export default mongoose.model('Dofus', dofusSchema);