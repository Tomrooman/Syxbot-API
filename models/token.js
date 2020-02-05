import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: String,
    access_token: String,
    token_type: String,
    expire_at: String,
    refresh_token: String,
    scope: String
}, {
    versionKey: false
});

tokenSchema.statics.get = (userId) => {
    if (!userId) {
        return false;
    }
    const Token = mongoose.model('Token', tokenSchema);
    return Token.findOne({
        userId: userId
    })
        .then(token => {
            if (token) {
                return token;
            }
            return false;
        });
};

export default mongoose.model('Token', tokenSchema);