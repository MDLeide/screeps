import { Empire } from "./Empire";
import { Settings } from "../Settings";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { ColonyPlanRepository } from "../colonyPlan/ColonyPlanRepository";

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
        
        var planName = this.getPlanName(flag);
        if (!flag) {//todo: follow up on created flags and add memory        
            var result = room.createFlag(25, 25, colonyName, ColonyFinder.flagMainColor, ColonyFinder.flagSecondaryColor);            
        }

        var nestMap = nestMapBuilder.getMap(room);
        var nest = new Nest(room.name, nestMap);
        var plan = ColonyPlanRepository.getNew(planName as PlanType);
        var colony = new Colony(nest, colonyName, plan);

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

    private static getColonyName(room: Room, flag: Flag) {
        if (flag && flag.memory && flag.memory.colonyData && flag.memory.colonyData.name)
            return flag.memory.colonyData.name;
        return "Colony " + room.name;
    }

    private static getPlanName(flag: Flag) {
        if (flag && flag.memory && flag.memory.colonyData && flag.memory.colonyData.plan)
            return flag.memory.colonyData.plan;
        return Settings.DefaultColonyPlan;
    }
}
