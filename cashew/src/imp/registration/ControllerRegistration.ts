import { CreepControllerRepository } from "../../lib/creep/CreepControllerRepository";
import { HarvesterController, HarvesterControllerMemory } from "../creep/HarvesterController";


export class ControllerRegistration {
    public static Register(): void {
        CreepControllerRepository.register(
            CREEP_CONTROLLER_HARVESTER,
            (mem: HarvesterControllerMemory) => HarvesterController.fromMemory(mem));
    }
}
