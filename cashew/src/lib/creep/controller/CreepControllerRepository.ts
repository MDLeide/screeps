import { CreepController } from "./CreepController";

export class CreepControllerRepository {
    public static register(controllerName: string, loadDelegate: (memory: CreepControllerMemory) => CreepController) {
        this.delegates[controllerName] = loadDelegate;
    }

    public static load(memory: CreepControllerMemory): CreepController {
        return this.delegates[memory.name](memory);
    }

    private static delegates: { [controllerName: string]: (memory: any) => CreepController };
}
