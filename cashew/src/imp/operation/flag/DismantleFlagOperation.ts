import { FlagOperation } from "lib/operation/FlagOperation";
import { Colony } from "lib/colony/Colony";
import { Operation } from "lib/operation/Operation";
import { DismantleOperation } from "../military/DismantleOperation";

export class DismantleFlagOperation extends FlagOperation {
    constructor(flag: Flag) {
        super(flag, FLAG_OPERATION_DISMANTLE);
    }

    public getHostColony(): Colony {
        return global.empire.getColonyByName(this.hostFlag.memory.flagOperation.hostColony);
    }

    public getOperation(): Operation {
        let targets = this.findTargets();
        return new DismantleOperation(targets);
    }

    private findTargets(): RoomPosition[] {
        let targets: RoomPosition[] = [];
        let flagNames = Object.keys(Game.flags);
        for (var i = 0; i < flagNames.length; i++)            
            if (Game.flags[flagNames[i]].name.startsWith(this.hostFlag.name))               
                targets.push(this.handleFlag(Game.flags[flagNames[i]]));
        return targets;
    }

    private handleFlag(flag: Flag): RoomPosition {
        let pos = flag.pos;
        flag.remove();
        return pos;
    }
}
