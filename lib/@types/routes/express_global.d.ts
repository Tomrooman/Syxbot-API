import { dofusType, dragodindeType, enclosType, sortedDragoType, notifArrayType } from '../models/dofus';
import { settingsType } from '../models/settings';
import { tokenType, tokenObjResponse } from '../models/token';

declare global {
    namespace NodeJS {
        interface Global {
            BOTsession: {
                jwt: string;
                token: string;
                type: string;
            };
            websiteCookies: string;
            websiteSession: {
                type: string;
                token: string;
            },
            badWebsiteCookies: string;
            customWebsiteCookies: string;
        }
    }
    namespace Express {
        interface Response {
            dragodindes: dofusType | dragodindeType | dragodindeType[] | notifArrayType[] | false;
            fecondator: sortedDragoType[] | false;
            ddFecond: dragodindeType | Partial<dragodindeType>;
            baseDate: number;
            dragodindesNotif: dofusType[] | false;
            notifArray: notifArrayType[] | false;
            sortedDragodindes: dragodindeType[];
            timeDiff: {
                hours: number,
                min: number,
                sec: number
            };
            notif: boolean | undefined;
            mail: boolean;
            enclos: enclosType[] | false;
            settings: settingsType | settingsType[] | boolean;
            token: tokenType | tokenObjResponse | boolean;
            discordData: string | false;
            allDofusInfos: dofusType | false;
        }

        interface Request {
            universalCookies: {
                get(name: string): {
                    username: string;
                    discriminator: string;
                    userID: string;
                    token_type: string;
                    expire_at: number;
                    secret: string;
                    jwt: string;
                }
            };
            user: any;
        }
    }
}
