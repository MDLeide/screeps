import { Empire } from "./Empire";
import { Settings } from "../Settings";
import { Colony } from "../colony/Colony";
import { Nest } from "../colony/Nest";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { NestMap } from "../map/NestMap"
import { MonitorManager, TypedMonitorManager } from "../monitor/MonitorManager";
import { ITypedMonitorProvider } from "../monitor/MonitorProvider";

/** Finds new colonies and adds them to the empire. */
export class ColonyFinder {
    public static flagMainColor: ColorConstant = COLOR_RED;
    public static flagSecondaryColor: ColorConstant = COLOR_YELLOW;


    constructor(nestMapBuilder: NestMapBuilder, monitorProvider: ITypedMonitorProvider<Colony>) {
        this.nestMapBuilder = nestMapBuilder;
        this.monitorProvider = monitorProvider;
    }


    public monitorProvider: ITypedMonitorProvider<Colony>;
    public nestMapBuilder: NestMapBuilder;


    /** Finds new colonies and adds them to the empire. */
    public createNewColonies(empire: Empire): void {
        let flags = this.findFlags();
        for (var i = 0; i < flags.length; i++) {
            if (!flags[i].room)
                continue

            let name = "Colony " + flags[i].room.name;
            if (this.colonyExists(empire, name))
                continue;
            let colony = this.buildFromFlag(this.nestMapBuilder, flags[i]);
            colony.initialize();
            empire.addColony(colony);
        }
    }

    public createColony(roomName: string): Colony {
        let name = "Colony " + roomName;
        if (this.colonyExists(global.empire, name)) {
            global.events.empire.colonyFailedToEstablish(roomName, "Colony already exists");
            return null;
        }
        let colony = this.buildFromName(roomName, name, this.nestMapBuilder);
        if (!colony)
            return null;

        colony.initialize();
        global.empire.addColony(colony);
        return colony;
    }

    private findFlags(): Flag[] {
        let flags = [];
        for (let key in Game.flags) {
            if (Game.flags[key].name == "newColony")
                flags.push(Game.flags[key]);
        }
        return flags;
    }

    private colonyExists(empire: Empire, colonyName: string): boolean {
        let colony = empire.getColonyByName(colonyName);
        if (colony)
            return true;
        return false;
    }
    
    private buildFromFlag(nestMapBuilder: NestMapBuilder, flag: Flag): Colony {
        if (!flag.room)
            return null;
        let name = "Colony " + flag.room.name;
        let nestMap = this.getNestMap(nestMapBuilder, flag.room);
        let nest = new Nest(flag.room.name, nestMap);
        let monitorManager = this.getMonitorManager();
        let colony = new Colony(nest, name, monitorManager);
        global.events.empire.colonyEstablished(name);
        return colony;  
    }

    private buildFromName(roomName: string, colonyName: string, nestMapBuilder: NestMapBuilder): Colony {
        let room = Game.rooms[roomName];
        if (!room) {
            global.events.empire.colonyFailedToEstablish(roomName, "No vision to room");
            return null;
        }

        let nestMap = this.getNestMap(nestMapBuilder, room);
        let nest = new Nest(roomName, nestMap);
        let monitorManager = this.getMonitorManager();
        let colony = new Colony(nest, colonyName, monitorManager);
        global.events.empire.colonyEstablished(colonyName);
        return colony;  
    }

    private getMonitorManager(): TypedMonitorManager<Colony> {
        return new TypedMonitorManager<Colony>(this.monitorProvider);
    }
    
    private getNestMap(nestMapBuilder: NestMapBuilder, room: Room): NestMap {
        let nestMap = nestMapBuilder.getMap(room);
        if (!nestMap)
            global.events.empire.colonyFailedToEstablish(room.name, "Failed to create nest map");
        return nestMap;
    }    
}
