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
    }
}
