import mongoose from 'mongoose';
import { tokenType, userStatic, tokenObjType } from '../@types/models/token';

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

tokenSchema.statics.get = async (userId: string): Promise<tokenType | false> => {
    if (userId) {
        const Token = mongoose.model<tokenType>('Token');
        const token = await Token.findOne({
            userId: userId
        });
        if (token) {
            return token;
        }
    }
    return false;
};

tokenSchema.statics.createToken = async (tokenObj: tokenType, expires_in: number): Promise<tokenType | false> => {
    if (tokenObj && expires_in) {
        const newTokenObj = {
            userId: tokenObj.userId,
            access_token: tokenObj.access_token,
            token_type: tokenObj.token_type,
            expire_at: (Date.now() / 1000) + expires_in,
            refresh_token: tokenObj.refresh_token,
            scope: tokenObj.scope
        };
        const Token = mongoose.model<tokenType>('Token');
        const tokenSaved = await new Token(newTokenObj).save();
        return tokenSaved;
    }
    return false;
};

tokenSchema.statics.updateToken = async (tokenInfos: tokenType, tokenObj: tokenObjType, expire_at: number): Promise<tokenType | false> => {
    if (tokenInfos && tokenObj) {
        tokenInfos.access_token = tokenObj.access_token;
        tokenInfos.token_type = tokenObj.token_type;
        tokenInfos.expire_at = expire_at;
        tokenInfos.refresh_token = tokenObj.refresh_token;
        tokenInfos.scope = tokenObj.scope;
        tokenInfos.markModified('access_token');
        tokenInfos.markModified('token_type');
        tokenInfos.markModified('expire_at');
        tokenInfos.markModified('refresh_token');
        tokenInfos.markModified('scope');
        const tokenSaved = await tokenInfos.save();
        return tokenSaved;
    }
    return false;
};

tokenSchema.statics.deleteToken = async (userId: string): Promise<boolean> => {
    if (userId) {
        const Token = mongoose.model<tokenType>('Token');
        const result = await Token.deleteOne({ userId: userId });
        if (result && result.ok === 1 && result.n === 1) {
            return true;
        }
    }
    return false;
};

export default mongoose.model<tokenType, userStatic>('Token', tokenSchema);
