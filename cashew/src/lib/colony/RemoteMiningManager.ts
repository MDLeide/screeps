import { Colony } from "./Colony";
import { RoomHelper } from "../util/RoomHelper";
import { Calculator } from "../util/Calculator";

export class RemoteMiningManager {
    public static fromMemory(memory: RemoteMiningManagerMemory, colony: Colony): RemoteMiningManager {
        let manager = new this(colony);
        for (var i = 0; i < memory.rooms.length; i++)
            manager.rooms.push(RemoteRoom.fromMemory(memory.rooms[i]));
        return manager;
    }


    constructor(colony: Colony) {
        this.colony = colony;
    }


    public colony: Colony;
    public rooms: RemoteRoom[] = [];
    public maxActiveRooms: number = 2;
    public get activeRoomCount(): number {
        let count = 0;
        for (var i = 0; i < this.rooms.length; i++)
            if (this.rooms[i].active)
                count++;
        return count;
    }

    public load(): void {
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].load();
    }

    public initialize(): void {
        this.rooms = [];
        for (var i = 0; i < 8; i++) {
            let name = RoomHelper.getAdjacentRoom(this.colony.nest.roomName, i);
            if (RoomHelper.isSourceKeeperRoom(name) || RoomHelper.isCenterRoom(name))
                continue;
            this.rooms.push(new RemoteRoom(name));
        }            
    }


    public getNextMiningAssignment(): { source: RemoteSource, room: RemoteRoom } {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].active) {
                for (var j = 0; j < this.rooms[i].remoteSources.length; j++) {
                    if (!this.rooms[i].remoteSources[j].beingMined)
                        return { room: this.rooms[i], source: this.rooms[i].remoteSources[j] };
                }
            }
        }

        if (this.activeRoomCount >= this.maxActiveRooms)
            return null;

        let closestRoom = this.getClosestInactiveRoom();
        if (closestRoom && closestRoom.remoteSources.length) {
            return { room: closestRoom, source: closestRoom.remoteSources[0] };
        }

        return null;
    }

    public scoutRoom(roomName: string): void {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name != roomName)
                continue;
            this.doScout(this.rooms[i]);
            return;
        }
    }

    public getRemoteSourceById(sourceId: string): RemoteSource {
        for (var i = 0; i < this.rooms.length; i++) {
            for (var j = 0; j < this.rooms[i].remoteSources.length; j++) {
                if (this.rooms[i].remoteSources[j].sourceId == sourceId)
                    return this.rooms[i].remoteSources[j];
            }
        }
        return null;
    }

    public getClosestUnscoutedRoom(currentRoomName: string): string {
        let min: number = 100;
        let room: string;

        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].scouted || this.rooms[i].beingScouted)
                continue;
            let route = Game.map.findRoute(currentRoomName, this.rooms[i].name);
            if (route == -2) {
                continue; // we won't update unreachable here, in case this is called with a funky current room
            } else {
                let dist = route.length;
                if (dist < min) {
                    min = dist;
                    room = this.rooms[i].name;
                }
            }
        }

        return room;
    }

    public releaseScoutJob(roomName: string): void {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name != roomName)
                continue;
            this.rooms[i].beingScouted = false;
            return;
        }
    }

    public claimScoutJob(roomName: string): void {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name != roomName)
                continue;
            this.rooms[i].beingScouted = true;
            return;
        }
    }


    private getClosestInactiveRoom(): RemoteRoom {
        let min = 100;
        let room: RemoteRoom;

        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].active)
                continue;

            let route = Game.map.findRoute(this.colony.nest.roomName, this.rooms[i].name);
            if (route == -2) {
                continue;
            } else if (route.length < min) {
                min = route.length;
                room = this.rooms[i];
            }
        }

        return room;
    }

    private doScout(remoteRoom: RemoteRoom): void {
        let room = Game.rooms[remoteRoom.name];
        if (!room) {
            global.events.remoteMining.scoutFailed(this.colony.name, remoteRoom.name);
            return;
        }

        let sources = room.find(FIND_SOURCES);

        for (var i = 0; i < sources.length; i++) {
            let result = Calculator.calculateSourceProfit(this.colony.nest.spawners[0].spawn.pos, sources[i], false, false, 50);
            if (!result)
                continue;
            if (result.profit < 350)
                continue;
            let remoteSource = new RemoteSource(sources[i].id);
            remoteSource.profit = result.profit;
            remoteRoom.remoteSources.push(remoteSource);
        }

        if (remoteRoom.remoteSources.length == 0) {
            let index = this.rooms.indexOf(remoteRoom);
            if (index >= 0)
                this.rooms.splice(index, 1);

            global.events.remoteMining.roomScoutedAndDiscarded(this.colony.name, remoteRoom.name);
            return;
        }

        remoteRoom.scouted = true;
        global.events.remoteMining.roomScoutedAndAdded(this.colony.name, remoteRoom.name);
    }

    protected getRoomMemory(): RemoteRoomMemory[] {
        let mem = [];
        for (var i = 0; i < this.rooms.length; i++) {
            mem.push(this.rooms[i].save());
        }
        return mem;
    }

    public save(): RemoteMiningManagerMemory {
        return {
            rooms: this.getRoomMemory()
        };
    }
}

export class RemoteRoom {
    public static fromMemory(memory: RemoteRoomMemory): RemoteRoom {
        let room = new this(memory.name);
        room.beingScouted = memory.beingScouted;
        room.scouted = memory.scouted;
        room.beingReserved = memory.beingReserved;
        for (var i = 0; i < memory.remoteSources.length; i++) 
            room.remoteSources.push(RemoteSource.fromMemory(memory.remoteSources[i]));
        return room;
    }

    constructor(roomName: string) {
        this.name = roomName;
    }

    public name: string;
    public scouted: boolean;
    public beingScouted: boolean;
    public get active(): boolean {
        for (var i = 0; i < this.remoteSources.length; i++) 
            if (this.remoteSources[i].beingMined)
                return true;
        return false;
    }
    public beingReserved: boolean;

    public remoteSources: RemoteSource[] = [];

    public load(): void {
        for (var i = 0; i < this.remoteSources.length; i++)
            this.remoteSources[i].load();
    }

    protected getRemoteSourceMemory(): RemoteSourceMemory[] {
        let mem = [];
        for (var i = 0; i < this.remoteSources.length; i++) {
            mem.push(this.remoteSources[i].save());
        }
        return mem;
    }

    public save(): RemoteRoomMemory {
        return {
            name: this.name,
            scouted: this.scouted,
            beingScouted: this.beingScouted,
            remoteSources: this.getRemoteSourceMemory(),
            beingReserved: this.beingReserved
        };
    }
}

export class RemoteSource {
    public static fromMemory(memory: RemoteSourceMemory): RemoteSource {
        let rs = new this(memory.sourceId);
        rs.containerId = memory.containerId;
        rs.beingMined = memory.beingMined;
        rs.profit = memory.profit;
        return rs;
    }

    constructor(sourceId: string) {
        this.sourceId = sourceId;
    }
    
    public sourceId: string;
    public containerId: string;    
    public beingMined: boolean;
    public profit: number;

    public source: Source;    
    public container: StructureContainer;

    public load(): void {
        if (this.sourceId)
            this.source = Game.getObjectById<Source>(this.sourceId);
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
    }

    public save(): RemoteSourceMemory {
        return {
            sourceId: this.sourceId,
            containerId: this.containerId,
            beingMined: this.beingMined,
            profit: this.profit
        };
    }
}
