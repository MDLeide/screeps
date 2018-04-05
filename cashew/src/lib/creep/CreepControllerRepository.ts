import { CreepController } from "./CreepController";

export class CreepControllerRepository {
    public static register(controllerType: CreepControllerType, loadDelegate: (memory: CreepControllerMemory) => CreepController) {
        this.delegates[controllerType] = loadDelegate;
    }

    public static load(memory: CreepControllerMemory): CreepController {
        let delegate = this.delegates[memory.type];
        if (!delegate)
            throw new Error(`Creep Controller Type ${memory.type} has not been registered.`);
        return delegate(memory);
    }

    private static delegates: { [controllerType: string]: (memory: any) => CreepController } = {};
}
