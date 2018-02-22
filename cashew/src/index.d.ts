import { UCreep } from "./lib/wrapper/Creep";

import { Cleaner } from "./lib/debug/Cleaner";
import { Logger } from "./lib/debug/Logger";
import { Reporter } from "./lib/debug/Reporter";
import { EventLog } from "./lib/util/EventLog";
import { Visuals } from "./lib/visual/Visuals";

import { CreepNut } from "./imp/extend/nut/CreepNut";
import { RoomNut } from "./imp/extend/nut/RoomNut";
import { SourceNut } from "./imp/extend/nut/SourceNut";
import { SpawnNut } from "./imp/extend/nut/SpawnNut";
import { ContainerNut } from "./imp/extend/nut/ContainerNut";
import { ControllerNut } from "./imp/extend/nut/ControllerNut";

import { TowerController } from "./imp/tower/TowerController";


declare global {
    const global: global;

    interface global {
        cleaner: Cleaner;
        logger: Logger;
        reports: Reporter;
        visuals: Visuals;
        events: EventLog;
        ucreep: UCreep;
        pause(): void;
        reset(): void;
    }

    interface StructureTower {
        controller: TowerController | null | undefined;
    }

    interface Creep {
        nut: CreepNut;
    }

    interface Room {
        nut: RoomNut;
    }

    interface Source {
        nut: SourceNut;
    }

    interface StructureSpawn {
        nut: SpawnNut;
    }

    interface StructureContainer {
        nut: ContainerNut;        
    }

    interface StructureController {
        nut: ControllerNut;
    }


    interface Coordinate {
        x: number;
        y: number;
    }    
}
