import { ConcreteClass } from "../lib/creep/Task";
import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";

import { Extender } from "./extend/Extender";
import { MemoryManager } from "../lib/util/MemoryManager";
import { Playback } from "../lib/debug/Playback";
import { Register } from "./registration/Register";

import { Reporter } from "../lib/debug/Reporter";

export class Execute {    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");
                
        Extender.extend();
        MemoryManager.checkInit();
        Register.register();
    }
    
    public main(): void {
        Playback.update();
        if (!Playback.loop())
            return;

        var empire = new Empire();
        global.empire = empire;
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
