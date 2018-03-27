import { FlagOperation } from "lib/operation/FlagOperation";
import { Colony } from "lib/colony/Colony";
import { Operation } from "lib/operation/Operation";
import { LootOperation } from "../military/LootOperation";

export class LootFlagOperation extends FlagOperation {
    constructor(flag: Flag) {
        super(flag, FLAG_OPERATION_LOOT);
    }

    public getHostColony(): Colony {
        return global.empire.getColonyByName(this.hostFlag.memory.flagOperation.hostColony);
    }
    public getOperation(): Operation {
        let struct = this.hostFlag.pos.lookFor(LOOK_STRUCTURES);
        for (var i = 0; i < struct.length; i++) {
            let s = struct[i];
            if (s instanceof StructureContainer || s instanceof StructureStorage || s instanceof StructureTerminal || s instanceof StructureLab || s instanceof StructureLink || s instanceof Tombstone) {
                return new LootOperation(s);
            }
        }
        return null;
    }
}
