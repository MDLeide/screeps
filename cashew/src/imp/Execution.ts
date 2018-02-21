import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";
import { MemoryManager } from "../lib/util/MemoryManager";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";
import { Extender } from "./extend/Extender";
import { RoleRegistration } from "./registration/RoleRegistration";
import { ActivityRegistration } from "./registration/ActivityRegistration";
import { ColonyPlanRegistration } from "./registration/ColonyPlanRegistration";
import { OperationRegistration } from "./registration/OperationRegistration";
// debug
import { Playback } from "../lib/debug/Playback";
import { Cleaner } from "../lib/debug/Cleaner";
import { Logger } from "../lib/debug/Logger";
import { Reporter } from "../lib/debug/Reporter";
import { EventLog } from "../lib/util/EventLog";
import { Visuals } from "../lib/visual/Visuals";
//import { StructureArtist } from "../lib/visual/StructureArtist";

export class Execute {    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");

        global.cleaner = new Cleaner();
        global.logger = new Logger();
        global.visuals = new Visuals();
        global.events = new EventLog();

        global.pause = function () { Playback.pause(); }
        global.reset = function () {
            Playback.pause();
            global.cleaner.cleanAll();
        }    

        Extender.extend();
        MemoryManager.checkInit();

        RoleRegistration.register();
        ActivityRegistration.register();
        ColonyPlanRegistration.register();
        OperationRegistration.register();
    }
    
    public main(): void {
        Playback.update();
        if (!Playback.loop())
            return;

        var empire = new Empire();
        var nestMapBuilder = StandardNestMapBuilder.getBuilder();

        ColonyFinder.createNewColonies(empire, nestMapBuilder);
        Playback.placeFlag(empire.colonies[0].nest.roomName);
        
        global.reports = new Reporter(empire);
        global.visuals.update(empire);

        try {            
            empire.load();
            empire.update();            
            empire.execute();
            empire.cleanup();            
            Memory.empire = empire.save();
        } catch (e) {
            if (Playback.pauseOnException)
                Playback.pause();            
            throw e;
        }
    }
}
