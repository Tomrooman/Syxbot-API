import { Document, Model } from 'mongoose';

export interface tokenType extends Document {
    userId: String;
    access_token: String;
    token_type: String;
    expire_at?: number;
    refresh_token: String;
    scope: String;
};

export interface tokenObjType {
    userId: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    scope: string;
};

export interface discordMe {
    data: {
        id: string;
        username: string;
        discriminator: string;
    };
};

export interface discordData {
    client_id: string;
    client_secret: string;
    grant_type: string;
    redirect_uri: string;
    scope: string;
    code?: string;
    refresh_token?: string
};

export interface apiToken {
    data: {
        token_type: string;
        expires_in: number;
    };
};

export interface userStatic extends Model<tokenType> {
    get(userId: string): Promise<tokenType> | false;

    createToken(tokenObj: tokenObjType, expires_in: number): Promise<tokenType> | false;

    updateToken(tokenInfos: tokenType, tokenObj: tokenObjType, expire_at: number): Promise<tokenType> | false;

    deleteToken(userId: string): boolean;
};