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
import { System, Version, SystemBuilder } from "lib/System";
import { Patch } from "lib/Patch";
import { StringBuilder } from "lib/util/StringBuilder";
import { MonitorManager, TypedMonitorManager } from "lib/monitor/MonitorManager";
import { StandardEmpireMonitorProvider } from "./empire/StandardEmpireMonitorProvider";

export class SystemSettings {
    public static major: number = 0;
    public static minor: number = 1;
    public static systemName: string = "Black Cat";
    public static forceDebug: boolean = false;
    public static forceDebugValue: boolean = true;
    public static automaticallyIncrementPatch: boolean = true;
}

export abstract class Foo {
    public static fromMemory(memory: FooMemory, instance: Foo): Foo {
        instance.quantity = memory.quantity;
        return instance;
    }

    public quantity: number;

    public save(): FooMemory {
        return {
            quantity: this.quantity
        };
    }
}

export interface FooMemory {
    quantity: number;
}

export class Bar extends Foo {
    public static fromMemory(memory: BarMemory): Bar {
        let bar = new this();
        bar.type = memory.type;
        return Foo.fromMemory(memory, bar) as Bar;
    }

    public type: string;

    public save(): BarMemory {
        let mem = super.save() as BarMemory;
        mem.type = this.type;
        return mem;
    }
}



export class Execute {    
    public init(): void {        
        this.setSystem();
        this.displaySystemInfo();
        MemoryManager.checkInit();
        Register.register();
        GlobalExtension.extend();
        VisualBuilder.build();

        if (global.system.codeChange) {
            Patch.patchMemory();
            this.setEmpire();
            Patch.patchEmpire();
            Memory.empire = global.empire.save();
        }
    }
    
    public main(): void {
        if (global.system.debug)
            if (!this.debug())
                return;

        this.setEmpire();
        
        if (global.empire.colonies.length) Playback.placeFlag(global.empire.colonies[0].nest.roomName); //debug
                
        this.run();
        global.visuals.draw();
        StatCollection.updateStats();
    }

    private debug(): boolean {
        Playback.update(); // debug
        return Playback.loop();            
    }

    private displaySystemInfo(): void {
        let sb = new StringBuilder();
        console.log();
        sb.append(global.system.toString(), "yellow");
        sb.append(" initializing . . .", "yellow");

        console.log(sb.toString());
        sb.clear();

        sb.append("Current tick", "tan");
        sb.append(": ", "white");
        sb.append(Game.time.toString(), "orange");

        sb.append(" | ", "white");

        sb.append("Last global's age", "tan");
        sb.append(": ", "white");
        sb.append(global.system.getLastGlobalAge().toString(), "orange");

        console.log(sb.toString());
        sb.clear();

        sb.append("Reset reason", "tan");
        sb.append(": ", "white");
        if (global.system.codeChange)
            sb.append("Code Change", "orange");
        else
            sb.append("Other", "orange");
        console.log(sb.toString());
        console.log();
    }

    private setSystem(): void {
        global.system = SystemBuilder.getSystem();
    }

    private setEmpire(): void {
        let colonyFinder = new ColonyFinder(StandardNestMapBuilder.getBuilder(), new StandardColonyMonitorProvider());
        if (Memory.empire)
            global.empire = Empire.fromMemory(Memory.empire, colonyFinder);
        else
            global.empire = new Empire(colonyFinder, new TypedMonitorManager<Empire>(new StandardEmpireMonitorProvider());
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
