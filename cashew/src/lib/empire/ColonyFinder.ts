import { Empire } from "./Empire";
import { Settings } from "../Settings";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { NestMap } from "../map/NestMap"
import { ColonyProgress, ColonyProgressRepository } from "../colony/ColonyProgress"
import { OperationPlan, OperationPlanRepository } from "../colony/OperationPlan";

/** Finds new colonies and adds them to the empire. */
export class ColonyFinder {
    public static flagMainColor: ColorConstant = COLOR_RED;
    public static flagSecondaryColor: ColorConstant = COLOR_YELLOW;
    
    /** Finds new colonies and adds them to the empire. */
    public static createNewColonies(empire: Empire, nestMapBuilder: NestMapBuilder): void {
        let flags = this.findFlags();
        for (var i = 0; i < flags.length; i++) {
            if (!flags[i].room)
                continue

            let name = this.getColonyName(flags[i].room, flags[i]);
            if (this.colonyExists(empire, name))
                continue;
            let colony = this.buildFromFlag(nestMapBuilder, flags[i]);
            colony.initialize();
            empire.addColony(colony);
        }
    }

    private static findFlags(): Flag[] {
        let flags = [];
        for (let key in Game.flags) {
            if (Game.flags[key].name == "newColony")
                flags.push(Game.flags[key]);
        }
        return flags;
    }

    private static colonyExists(empire: Empire, colonyName: string): boolean {
        let colony = empire.getColonyByName(colonyName);
        if (colony)
            return true;
        return false;
    }
    
    private static buildFromFlag(nestMapBuilder: NestMapBuilder, flag: Flag): Colony {
        let name = this.getColonyName(flag.room, flag);
        let nestMap = this.getNestMap(nestMapBuilder, flag.room);
        let nest = new Nest(flag.room.name, nestMap);
        let progress = this.getProgress(flag);
        let plans = this.getOperationPlans(flag);
        let colony = new Colony(nest, name, progress);
        for (var i = 0; i < plans.length; i++)
            colony.addOperationPlan(plans[i]);
        global.events.empire.colonyEstablished(name);
        return colony;  
    }

    private static getColonyName(room: Room, flag: Flag): string {
        if (flag && flag.memory && flag.memory.colonyData && flag.memory.colonyData.name)
            return flag.memory.colonyData.name;
        return "Colony " + room.name;
    }

    private static getNestMap(nestMapBuilder: NestMapBuilder, room: Room): NestMap {
        let nestMap = nestMapBuilder.getMap(room);
        if (!nestMap)
            global.events.empire.colonyFailedToEstablish(room.name, "Failed to create nest map");
        return nestMap;
    }

    private static getProgress(flag: Flag): ColonyProgress {
        let type: ProgressType;
        if (flag.memory && flag.memory.colonyData && flag.memory.colonyData.progress)
            type = flag.memory.colonyData.progress;
        else
            type = Settings.DefaultProgress;
        return ColonyProgressRepository.getNew(type);
    }

    private static getOperationPlans(flag: Flag): OperationPlan[] {
        let planTypes = [];
        if (flag.memory && flag.memory.colonyData && flag.memory.colonyData.operationPlans && flag.memory.colonyData.operationPlans.length > 0) {
            for (var i = 0; i < flag.memory.colonyData.operationPlans.length; i++)
                planTypes.push(flag.memory.colonyData.operationPlans[i]);            
        } else {
            for (var i = 0; i < Settings.DefaultOperationPlans.length; i++)
                planTypes.push(Settings.DefaultOperationPlans[i]);            
        }

        let plans = [];
        for (var i = 0; i < planTypes.length; i++)
            plans.push(OperationPlanRepository.getNew(planTypes[i]));
        return plans;
    }
}
