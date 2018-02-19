import { Empire } from "../lib/empire/Empire"
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";
import { Extender } from "./extend/Extender";
import { MemoryManager } from "../lib/memory/Manager";
import { RoleRegistration } from "./registration/RoleRegistration";
import { ActivityRegistration } from "./registration/ActivityRegistration";
import { ColonyPlanRegistration } from "./registration/ColonyPlanRegistration";
import { OperationRegistration } from "./registration/OperationRegistration";
// debug
import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";
import { Logger } from "../lib/debug/Logger";
import { Reporter } from "../lib/debug/Reporter";

export class Execute {
    private empire: Empire;
    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");

        this.debug();

        Extender.extend();
        MemoryManager.checkInit();

        this.registrations();        
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
    }

    public main(): void {
        Playback.update();
        if (!Playback.loop())
            return;

        this.empire = new Empire(StandardNestMapBuilder.getBuilder());
        global.reports = new Reporter(this.empire);

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
