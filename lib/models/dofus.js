import mongoose from 'mongoose';

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
    if (!userId) {
        return false;
    }
    const Dofus = mongoose.model('Dofus', dofusSchema);
    const dofus_infos = await Dofus.findOne({
        userId: userId
    });
    if (dofus_infos) {
        return dofus_infos;
    }
    return false;
};

export default mongoose.model('Dofus', dofusSchema);