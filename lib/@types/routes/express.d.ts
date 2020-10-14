import { dofusInfosType, dragodindeType, enclosType, sortedDragoType, notifArrayType } from '../models/dofus_infos';
import { settingsType } from '../models/settings';
import { tokenType, tokenObjResponse } from '../models/token';

declare global {
    namespace Express {
        interface Response {
            dragodindes: dofusInfosType | dragodindeType | dragodindeType[] | notifArrayType[] | false;
            fecondator: sortedDragoType[] | false;
            ddFecond: dragodindeType | Partial<dragodindeType>;
            baseDate: number;
            dragodindesNotif: dofusInfosType[] | false;
            notifArray: notifArrayType[] | false;
            sortedDragodindes: dragodindeType[];
            timeDiff: {
                hours: number,
                min: number,
                sec: number
            };
            notif: boolean | undefined,
            mail: boolean;
            enclos: enclosType[] | false;
            settings: settingsType | settingsType[] | boolean;
            token: tokenType | tokenObjResponse | boolean;
            discordData: string | false;
            allDofusInfos: dofusInfosType | false;
        }

        interface Request {
            universalCookies: {
                get(name: string): {
                    username: string,
                    discriminator: string,
                    userId: string
                    token_type: string,
                    expire_at: number,
                    secret: string,
                    jwt: string
                }
            };
            user: any;
        }
    }
}
