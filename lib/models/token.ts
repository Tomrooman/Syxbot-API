import mongoose from 'mongoose';
import { tokenType, userStatic, tokenObjType } from '../@types/models/token';

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    token_type: {
        type: String,
        required: true
    },
    expire_at: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

tokenSchema.statics.get = async (userID: string): Promise<tokenType | false> => {
    if (userID) {
        const Token = mongoose.model<tokenType>('Token');
        const token = await Token.findOne({
            userID: userID
        }).lean();
        if (token) return token as tokenType;
    }
    return false;
};

tokenSchema.statics.createToken = async (tokenObj: tokenType, expires_in: number): Promise<tokenType | false> => {
    if ((tokenObj && Object.keys(tokenObj).length) && expires_in) {
        const newTokenObj = {
            userID: tokenObj.userID,
            access_token: tokenObj.access_token,
            token_type: tokenObj.token_type,
            expire_at: (Date.now() / 1000) + expires_in,
            refresh_token: tokenObj.refresh_token,
            scope: tokenObj.scope
        };
        const Token = mongoose.model<tokenType>('Token');
        const tokenSaved = await new Token(newTokenObj).save();
        return tokenSaved.toObject();
    }
    return false;
};

tokenSchema.statics.updateToken = async (tokenInfos: tokenType, tokenObj: tokenObjType, expire_at: number): Promise<tokenType | false> => {
    if ((tokenInfos && Object.keys(tokenInfos).length) &&
        (tokenObj && Object.keys(tokenObj).length) &&
        expire_at) {
        tokenInfos.access_token = tokenObj.access_token;
        tokenInfos.token_type = tokenObj.token_type;
        tokenInfos.expire_at = expire_at;
        tokenInfos.refresh_token = tokenObj.refresh_token;
        tokenInfos.scope = tokenObj.scope;
        tokenInfos = mongoose.model<tokenType>('Token').hydrate(tokenInfos);
        tokenInfos.markModified('access_token');
        tokenInfos.markModified('token_type');
        tokenInfos.markModified('expire_at');
        tokenInfos.markModified('refresh_token');
        tokenInfos.markModified('scope');
        const tokenSaved = await tokenInfos.save();
        return tokenSaved.toObject();
    }
    return false;
};

tokenSchema.statics.deleteToken = async (userID: string): Promise<boolean> => {
    if (userID) {
        const Token = mongoose.model<tokenType>('Token');
        const result = await Token.deleteOne({ userID: userID });
        if (result && result.ok === 1 && result.n === 1) return true;
    }
    return false;
};

export default mongoose.model<tokenType, userStatic>('Token', tokenSchema);
