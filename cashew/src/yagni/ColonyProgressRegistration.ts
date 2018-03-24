//import { ColonyProgress, ColonyProgressRepository } from "../../lib/colony/ColonyProgress";
//import { StandardProgress } from "../colony/StandardProgress";

//export class ColonyProgressRegistration {
//    public static register() {
//        ColonyProgressRepository.register(
//            PROGRESS_STANDARD,
//            (mem: ColonyProgressMemory) => {
//                return ColonyProgress.fromMemory(mem, StandardProgress.getMilestones());
//            },
//            () => {
//                return new ColonyProgress(PROGRESS_STANDARD, StandardProgress.getMilestones());
//            }
//        );
//    }
//}
