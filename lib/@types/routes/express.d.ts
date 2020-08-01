import { dofusInfosType, dragodindeType, noteType, sortedDragoType } from "../models/dofus_infos";
import { settingsType } from "../models/settings";
import { tokenType, discordData } from "../models/token";

declare global {
    namespace Express {
        interface Response {
            dragodindes: dofusInfosType | dragodindeType | dragodindeType[] | false;
            fecondator: sortedDragoType[] | false;
            ddFecond: dragodindeType | undefined;
            baseDate: number;
            dragodindesNotif: dofusInfosType[] | false;
            sortedDragodindes: dragodindeType[];
            timeDiff: {
                hours: number,
                min: number,
                sec: number
            }
            mail: boolean;
            notes: noteType[] | false;
            settings: settingsType | settingsType[] | boolean;
            token: tokenType | boolean;
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
                }
            };
        }
    }
}
