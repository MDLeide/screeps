import { RoleRegistration } from "./RoleRegistration";
import { ActivityRegistration } from "./ActivityRegistration";
import { ColonyPlanRegistration } from "./ColonyPlanRegistration";
import { ColonyOperationRegistration } from "./ColonyOperationRegistration";
import { BodyRegistration } from "./BodyRegistration";

//import { TowerController } from "./tower/TowerController";
import { Extender } from "./extend/Extender";

import { MemoryManager } from "../lib/memory/Manager";
import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";

// debug
import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";

export class Execute {
    private empire: Empire;

    public init(): void {
        if (!global.cleaner)
            global.cleaner = new Cleaner();

        Playback.update();
        if (!Playback.init())
            return;        

        console.log("<span style='color:green'>Execution initializing...</span>");

        MemoryManager.checkInit();
        Extender.extend();

        RoleRegistration.register();
        ActivityRegistration.register();

        ColonyPlanRegistration.register();
        ColonyOperationRegistration.register();

        BodyRegistration.register();

        this.empire = Empire.getEmpireInstance();
        console.log("<span style='color:green'>done</span>");
    }

    public main(): void {
        Playback.update();
        if (!Playback.loop())
            return;

        ColonyFinder.createNewColonies(this.empire);
        this.empire.update();
        this.empire.execute();        
        this.empire.cleanup();
        }
}
