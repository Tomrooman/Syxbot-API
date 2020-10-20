import { Document, Model } from 'mongoose';

export interface tokenType extends Document {
    userId: string;
    access_token: string;
    token_type: string;
    expire_at?: number;
    refresh_token: string;
    scope: string;
}

export interface tokenObjResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
    expire_at: number;
    type: string;
    jwt: string;
}

export interface tokenObjType {
    userId: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    scope: string;
}

export interface discordMeType {
    data: {
        id: string;
        username: string;
        discriminator: string;
    };
}

export interface apiTokenType {
    data: {
        token_type: string;
        expires_in: number;
        access_token: string;
    };
}

export interface userStatic extends Model<tokenType> {
    get(userId: string): Promise<tokenType> | false;

    createToken(tokenObj: tokenObjType, expires_in: number): Promise<tokenType> | false;

    updateToken(tokenInfos: tokenType, tokenObj: tokenObjType, expire_at: number): Promise<tokenType> | false;

    deleteToken(userId: string): Promise<boolean>;
}