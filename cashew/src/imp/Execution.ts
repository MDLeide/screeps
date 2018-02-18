import { Empire } from "../lib/empire/Empire"

import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";

import { Extender } from "./extend/Extender";
import { MemoryManager } from "../lib/memory/Manager";

import { RoleRegistration } from "./RoleRegistration";
import { ActivityRegistration } from "./ActivityRegistration";
import { ColonyPlanRegistration } from "./ColonyPlanRegistration";
import { OperationRegistration } from "./OperationRegistration";
import { BodyRegistration } from "./BodyRegistration";

//import { TowerController } from "./tower/TowerController";

// debug
import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";
import { Logger } from "../lib/debug/Logger";

export class Execute {
    private empire: Empire;
    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");

        this.debug();
        if (!Playback.init())
            return;                
        MemoryManager.checkInit();
        Extender.extend();        
        this.registrations();
        this.empire = new Empire(StandardNestMapBuilder.getBuilder());
    }

    private debug(): void {
        if (!global.cleaner)
            global.cleaner = new Cleaner();
        if (!global.logger)
            global.logger = new Logger();
        if (!global.pause)
            global.pause = function () { Playback.pause(); }
        Playback.update();
    }

    private registrations(): void {
        RoleRegistration.register();
        ActivityRegistration.register();
        ColonyPlanRegistration.register();
        OperationRegistration.register();
        BodyRegistration.register();
    }

    public main(): void {
        Playback.update();
        if (!Playback.loop())
            return;
        
        try {
            this.empire.load();
            this.empire.update();
            this.empire.execute();
            this.empire.cleanup();
            Memory.empire = this.empire.save();
        } catch (e) {
            if (Playback.pauseOnException)
                Playback.pause();            
            throw e;
        }        
    }
}
