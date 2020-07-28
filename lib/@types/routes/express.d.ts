import { dofusInfosType, dragodindeType, noteType } from "../models/dofus_infos";
import { settingsType } from "../models/settings";
import { tokenType } from "../models/token";

declare global {
    namespace Express {
        interface Response {
            dragodindes: dragodindeType | dragodindeType[] | false;
            dragodindesNotif: dofusInfosType[] | false;
            mailStatus: boolean;
            notes: noteType[] | false;
            settings: settingsType | settingsType[] | false;
            token: tokenType | boolean;
        }
    }
}
