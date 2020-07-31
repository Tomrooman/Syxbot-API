import { dofusInfosType, dragodindeType, noteType, sortedDragoType } from "../models/dofus_infos";
import { settingsType } from "../models/settings";
import { tokenType } from "../models/token";

declare global {
    namespace Express {
        interface Response {
            dragodindes: dragodindeType | dragodindeType[] | false;
            fecondator: sortedDragoType[] | false;
            ddFecond: sortedDragoType | false;
            dragodindesNotif: dofusInfosType[] | false;
            mail: boolean;
            notes: noteType[] | false;
            settings: settingsType | settingsType[] | false;
            token: tokenType | boolean;
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
