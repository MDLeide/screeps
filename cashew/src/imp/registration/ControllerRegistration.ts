import { CreepControllerRepository } from "../../lib/creep/controller/CreepControllerRepository";
import { HarvesterController, HarvesterControllerMemory } from "../creep/controller/HarvesterController";


export class ControllerRegistration {
    public static Register(): void {
        CreepControllerRepository.register(HarvesterController.myName, (mem: HarvesterControllerMemory ) => HarvesterController.fromMemory(mem));
    }
}
