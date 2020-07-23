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

tokenSchema.statics.get = async (userId) => {
    if (userId) {
        const Token = mongoose.model('Token');
        const token = await Token.findOne({
            userId: userId
        });
        if (token) {
            return token;
        }
    }
    return false;
};

tokenSchema.statics.createToken = async (tokenObj, expires_in) => {
    if (tokenObj && expires_in) {
        const newTokenObj = {
            userId: tokenObj.userId,
            access_token: tokenObj.access_token,
            token_type: tokenObj.token_type,
            expire_at: (Date.now() / 1000) + expires_in,
            refresh_token: tokenObj.refresh_token,
            scope: tokenObj.scope
        };
        const Token = mongoose.model('Token');
        await new Token(newTokenObj).save();
        return newTokenObj;
    }
    return false;
};

tokenSchema.statics.updateToken = async (tokenInfos, tokenObj, expire_at) => {
    if (tokenInfos && tokenObj) {
        tokenInfos.access_token = tokenObj.access_token;
        tokenInfos.token_type = tokenObj.token_type;
        tokenInfos.expire_at = expire_at;
        tokenInfos.refresh_token = tokenObj.refresh_token;
        tokenInfos.scope = tokenObj.scope;
        await tokenInfos.save();
        return tokenInfos;
    }
    return false;
};

tokenSchema.statics.deleteToken = async (userId) => {
    if (userId) {
        const Token = mongoose.model('Token');
        const result = await Token.deleteOne({ userId: userId });
        if (result && result.ok === 1) {
            return true;
        }
    }
    return false;
};

export default mongoose.models.Token || mongoose.model('Token', tokenSchema);