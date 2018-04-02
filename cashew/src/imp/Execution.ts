import { Empire } from "../lib/empire/Empire"
import { ColonyFinder } from "../lib/empire/ColonyFinder";
import { NestMapBuilder } from "../lib/map/NestMapBuilder";
import { StandardNestMapBuilder } from "./map/StandardNestMapBuilder";

import { MemoryManager } from "../lib/util/MemoryManager";
import { Playback } from "../lib/util/dbg/Playback";
import { Register } from "./registration/Register";

import { GlobalExtension } from "../imp/GlobalExtension";
import { VisualBuilder } from "../lib/visual/VisualBuilder";

import { StatCollection } from "../lib/StatCollection";
import { StandardColonyMonitorProvider } from "./colony/StandardColonyMonitorProvider";
import { System, Version } from "lib/System";
import { Patch } from "lib/Patch";

export class SystemSettings {
    public static major: number = 0;
    public static minor: number = 1;
    public static systemName: string = "Black Cat";
    public static forceDebug: boolean = false;
    public static forceDebugValue: boolean = true;
    public static automaticallyIncrementPatch: boolean = true;
}

export class Execute {    
    public init(): void {        
        console.log("<span style='color:green'>Execution initializing...</span>");        
        MemoryManager.checkInit();
        Register.register();
        GlobalExtension.extend();
        this.setSystem();
        if (global.system.codeChange)
            Patch.patch();
    }
    
    public main(): void {
        if (global.system.debug)
            if (!this.debug())
                return;

        this.setEmpire();
        
        if (global.empire.colonies.length) Playback.placeFlag(global.empire.colonies[0].nest.roomName); //debug

        VisualBuilder.build();
        this.run();
        global.visuals.draw();
        StatCollection.updateStats();
    }

    private debug(): boolean {
        Playback.update(); // debug
        return Playback.loop();            
    }

    private setSystem(): void {
        if (!Memory.system) {
            Memory.system = {
                major: SystemSettings.major,
                minor: SystemSettings.minor,
                patch: 0,
                lastUpdate: new Date().valueOf(),
                debug: SystemSettings.forceDebugValue,
                name: SystemSettings.name,
                resetHistory: [],
                codeChangeHistory: []
            };
        }

        global.system = new System(
            SystemSettings.name,
            new Version(SystemSettings.major, SystemSettings.minor, Memory.system.patch),
            Memory.system.lastUpdate
        );

        global.system.debug = SystemSettings.forceDebug ? SystemSettings.forceDebugValue : Memory.system.debug;
        global.system.resetHistory = Memory.system.resetHistory;
        global.system.resetHistory.push(Game.time);

        if (global.system.version.major != Memory.system.major || global.system.version.minor != Memory.system.minor) 
            global.system.version.patch = 0; // reset patch on major/minor update
        
        if (module.timestamp != global.system.lastUpdate) {
            global.system.lastUpdate = module.timestamp;
            global.system.codeChangeHistory.push(Game.time);
            if (SystemSettings.automaticallyIncrementPatch)
                global.system.version.patch++;            
        }

        if (global.system.codeChangeHistory.length > 5)
            global.system.codeChangeHistory.splice(0, 1);
        if (global.system.resetHistory.length > 5)
            global.system.resetHistory.splice(0, 1);

        Memory.system = {
            major: global.system.version.major,
            minor: global.system.version.minor,
            patch: global.system.version.patch,
            debug: global.system.debug,
            name: global.system.name,
            lastUpdate: global.system.lastUpdate,
            resetHistory: global.system.resetHistory,
            codeChangeHistory: global.system.codeChangeHistory
        }
    }

    private setEmpire(): void {
        let colonyFinder = new ColonyFinder(StandardNestMapBuilder.getBuilder(), new StandardColonyMonitorProvider());
        let empire = new Empire(colonyFinder);
        global.empire = empire;
    }

    private run(): void {
        try {
            global.empire.load();
            global.empire.update();
            global.empire.execute();
            global.empire.cleanup();
            Memory.empire = global.empire.save();
        } catch (e) {
            if (Playback.pauseOnException)
                Playback.pause();
            throw e;
        }
    }
}
