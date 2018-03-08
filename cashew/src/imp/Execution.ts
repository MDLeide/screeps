import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";

import { MemoryManager } from "../lib/util/MemoryManager";
import { Playback } from "../lib/util/dbg/Playback";
import { Register } from "./registration/Register";

import { GlobalExtension } from "../imp/GlobalExtension";

export class Execute {    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");        
        MemoryManager.checkInit();
        Register.register();
        GlobalExtension.extend();
    }
    
    public main(): void {        
        Playback.update();
        if (!Playback.loop())
            return;

        var empire = new Empire();
        GlobalExtension.extend(empire);
        
        var nestMapBuilder = StandardNestMapBuilder.getBuilder();
        ColonyFinder.createNewColonies(empire, nestMapBuilder);
        if (empire.colonies.length)
            Playback.placeFlag(empire.colonies[0].nest.roomName);

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
        global.visuals.update(empire);
    }
}
