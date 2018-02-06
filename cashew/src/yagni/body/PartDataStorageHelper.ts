//import { PartDataHelper } from "./PartDataHelper";
//import { PartData } from "./PartData";
//import { Part } from "./Part";
//import { PartType } from "./PartType";

//export class PartDataStorageHelper {
//    private data: { [partType: number]: PartData } = {};

//    public getData(part: string | PartType): PartData {
//        if (_.isString(part)) {
//            part = Part.StringToPartType(part);
//            if (!part) {
//                throw new Error('argument out of range');
//            }
//        }
//        if (!this.data[part]) {
//            this.data[part] = this.makeData(part);
//        }
//        return this.data[part];
//    }

//    private makeData(part: PartType): PartData {
//        switch (part) {
//            case PartType.ATTACK:
//                return PartDataHelper.attack();
//            case PartType.CARRY:
//                return PartDataHelper.carry();
//            case PartType.CLAIM:
//                return PartDataHelper.claim();
//            case PartType.HEAL:
//                return PartDataHelper.heal();
//            case PartType.MOVE:
//                return PartDataHelper.move();
//            case PartType.RANGED_ATTACK:
//                return PartDataHelper.rangedAttack();
//            case PartType.TOUGH:
//                return PartDataHelper.tough();
//            case PartType.WORK:
//                return PartDataHelper.work();
//            default:
//                throw new Error('argument out of range');
//        }
//    }
//}
