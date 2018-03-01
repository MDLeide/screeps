import { Empire } from "./Empire";
import { Settings } from "../Settings";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { ColonyProgress, ColonyProgressRepository } from "../colony/ColonyProgress"
import { OperationPlan, OperationPlanRepository } from "../colony/OperationPlan";

/** Finds new colonies and adds them to the empire. */
export class ColonyFinder {
    public static flagMainColor: ColorConstant = COLOR_RED;
    public static flagSecondaryColor: ColorConstant = COLOR_YELLOW;
    
    /** Finds new colonies and adds them to the empire. */
    public static createNewColonies(empire: Empire, nestMapBuilder: NestMapBuilder): void {
        for (var key in Game.spawns) {
            var colony = this.buildColony(empire, Game.spawns[key].room, nestMapBuilder);
            if (colony)
                empire.addColony(colony);
        }
    }

    private static buildColony(empire: Empire, room: Room, nestMapBuilder: NestMapBuilder): Colony {        
        var flag = this.findFlag(room);
        var colonyName = this.getColonyName(room, flag);

        if (!this.needsColonyBuilt(empire, colonyName))
            return null;
                
        if (!flag) {//todo: follow up on created flags and add memory        
            var result = room.createFlag(25, 25, colonyName, ColonyFinder.flagMainColor, ColonyFinder.flagSecondaryColor);            
        }

        var nestMap = nestMapBuilder.getMap(room);
        var nest = new Nest(room.name, nestMap);

        let progress = ColonyProgressRepository.getNew(Settings.DefaultProgress);
        var colony = new Colony(nest, colonyName, progress);

        for (var i = 0; i < Settings.DefaultOperationPlans.length; i++) {
            let plan = OperationPlanRepository.getNew(Settings.DefaultOperationPlans[i]);
            colony.addOperationPlan(plan);
        }

        global.events.empire.colonyEstablished(colonyName);

        return colony;
    }

    private static needsColonyBuilt(empire: Empire, colonyName: string): boolean {
        for (var i = 0; i < empire.colonies.length; i++)
            if (empire.colonies[i].name == colonyName)
                return false;
        return true;
    }

    private static findFlag(room: Room): Flag {
        var flags = room.find(FIND_FLAGS);
        for (var i = 0; i < flags.length; i++)
            if (flags[i].color == ColonyFinder.flagMainColor && flags[i].secondaryColor == ColonyFinder.flagSecondaryColor)
                return flags[i];
        return null;
    }

    private static getColonyName(room: Room, flag: Flag): string {
        if (flag && flag.memory && flag.memory.colonyData && flag.memory.colonyData.name)
            return flag.memory.colonyData.name;
        return "Colony " + room.name;
    }


}