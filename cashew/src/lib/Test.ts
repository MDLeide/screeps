import { ColonyDefenseMonitor } from "../imp/colony/militaryMonitors/ColonyDefenseMonitor";
import { ObserverConstructionOperation } from "../imp/operation/infrastructure/ObserverConstructionOperation";
import { ExtensionFillOperation } from "../imp/operation/economic/ExtensionFillOperation";
import { ReplaceOriginalSpawnOperation } from "../imp/operation/infrastructure/ReplaceOriginalSpawnOperation";
import { Empire } from "../lib/empire/Empire";
import { BodyRepository } from "../imp/creep/BodyRepository";
import { Assignment } from "../lib/operation/Assignment";
import { RoomHelper } from "./util/RoomHelper";

export class Test {
    public test(): string {
        let pos = new RoomPosition(5, 5, "E1N1");
        let converted = RoomHelper.getGlobalPosition(pos);
        let andBack = RoomHelper.getRoomPositionFromGlobalPosition(converted);
        
        console.log(`Converted: {${converted.x}, ${converted.y}}`);
        console.log(`Back: {${andBack.x}, ${andBack.y}, ${andBack.roomName}}`);

        return "";
    }

    public cleanup(): void {
        this.clearOrders();
        this.clearSupplyOps();
        this.clearQueues();
        this.kill();
    }

    public clearOrders(): void {
        global.empire.exchange.demandOrders = {};
        global.empire.exchange.supplyOrders = {};
        global.empire.exchange.transactions = {};
        Memory.empire = global.empire.save();
    }

    public clearSupplyOps(): void {
        global.empire.colonies.forEach(p => p.operations.cancelOperationByType(p, OPERATION_SUPPLY));
        Memory.empire = global.empire.save();
    }

    public kill(): void {
        for (let name in Game.creeps)
            if (!Game.creeps[name].memory.operation)
                Game.creeps[name].suicide();
    }

    public clearQueues(): void {
        global.empire.colonies.forEach(p => p.nest.clearSpawnQueue());
        Memory.empire = global.empire.save();
    }
}
