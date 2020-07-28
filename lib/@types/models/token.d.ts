import { Document, Model } from 'mongoose';

export interface tokenType extends Document {
    userId: String;
    access_token: String;
    token_type: String;
    expire_at?: number;
    refresh_token: String;
    scope: String;
}

export interface tokenObjType {
    userId: string;
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface userStatic extends Model<tokenType> {
    get(userId: string): Promise<tokenType> | false;

    createToken(tokenObj: tokenObjType, expires_in: number): Promise<tokenType> | false;

    updateToken(tokenInfos: tokenType, tokenObj: tokenObjType, expire_at: number): Promise<tokenType> | false;

    deleteToken(userId: string): boolean;
}