import { Empire } from "./Empire";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";

import { ColonyPlanRepository } from "../colony/repo/ColonyPlanRepository";
import { NestRepository } from "../colony/repo/NestRepository";

import { Settings } from "../Settings";

/** Finds new colonies and adds them to the empire. */
export class ColonyFinder {
    public static flagMainColor: ColorConstant = COLOR_RED;
    public static flagSecondaryColor: ColorConstant = COLOR_YELLOW;

    private static _colonyPlanRepo = new ColonyPlanRepository();
    private static _nestRepo = new NestRepository();

    /** Finds new colonies and adds them to the empire. */
    public static createNewColonies(empire: Empire): void {
        for (var key in Game.spawns) {
            var spawn = Game.spawns[key];
            var name = spawn.room.name;
            
            if (Memory.colonies[name])
                continue;

            var room = spawn.room;
            var flags = room.find(FIND_FLAGS);

            var colonyName = "Colony " + room.name;            
            var planName = Settings.DefaultColonyPlan;
            
            var flagFound = false;

            for (var i = 0; i < flags.length; i++) {
                if (flags[i].color == ColonyFinder.flagMainColor && flags[i].color == ColonyFinder.flagSecondaryColor) {
                    colonyName = flags[i].name;
                    flagFound = true;

                    if (flags[i].memory && flags[i].memory.colonyData) {
                        if (flags[i].memory.colonyData.name)
                            colonyName = flags[i].memory.colonyData.name;
                        if (flags[i].memory.colonyData.plan)
                            planName = flags[i].memory.colonyData.plan;
                    }                     
                }
            }

            if (!flagFound) {
                var result = room.createFlag(25, 25, colonyName, ColonyFinder.flagMainColor, ColonyFinder.flagSecondaryColor);
                //todo: follow up on created flags and add memory
            }
            
            var nest = new Nest(room.name);
            this._nestRepo.add(nest);

            var plan = this._colonyPlanRepo.getNew(planName);
            this._colonyPlanRepo.add(plan);

            var colony = new Colony(nest, colonyName, plan);
            empire.addColony(colony);
        }
    }
}
