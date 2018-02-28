import { CreepController } from "./CreepController";

export class CreepControllerRepository {
    public static register(controllerType: ControllerType, loadDelegate: (memory: CreepControllerMemory) => CreepController) {
        this.delegates[controllerType] = loadDelegate;
    }

    public static load(memory: CreepControllerMemory): CreepController {
        return this.delegates[memory.type](memory);
    }

    private static delegates: { [controllerType: string]: (memory: any) => CreepController } = {};
}
