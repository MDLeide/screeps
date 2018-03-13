import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";

import { MemoryManager } from "../lib/util/MemoryManager";
import { Playback } from "../lib/util/dbg/Playback";
import { Register } from "./registration/Register";

import { GlobalExtension } from "../imp/GlobalExtension";
import { VisualBuilder } from "../lib/visual/VisualBuilder";

import { Stats } from "../lib/Stats";

export class Execute {    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");        
        MemoryManager.checkInit();
        Register.register();
    }
    
    public main(): void {        
        Playback.update(); // debug
        if (!Playback.loop())
            return;

        let colonyFinder = new ColonyFinder(StandardNestMapBuilder.getBuilder());
        var empire = new Empire(colonyFinder);
        GlobalExtension.extendEmpire(empire);
        GlobalExtension.extend();
        
        if (empire.colonies.length) //debug
            Playback.placeFlag(empire.colonies[0].nest.roomName);

        VisualBuilder.build();

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

        global.visuals.draw();
        Stats.updateStats();
    }
}
