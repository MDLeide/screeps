import { RoomHelper, RoomType } from "../util/RoomHelper";
import { NestMap } from "../map/NestMap";
import { Colony } from "lib/colony/Colony";
import { MapScoutOperation } from "imp/operation/military/MapScoutOperation";
import { Calculator } from "../util/Calculator";
import { RemoteRoom } from "lib/empire/RemoteMiningPlanner";

export class MapScouter {
    public static maxPathRange: number = 3;

    public static scout(): void {
        let roomDistances = this.getRooms(this.maxPathRange);
        let rooms = this.sortRooms(roomDistances);
        while (rooms.length > 0) {
            let r = rooms.splice(0, 1)[0];
            let c = global.empire.getNearestColony(r);
            let path = this.getPath(c, r);
            for (var i = 0; i < path.length; i++) {
                let index = rooms.indexOf(path[i]);
                if (index >= 0)
                    rooms.splice(index, 1);
            }
            this.startScoutOp(c, path);
        }
    }

    private static startScoutOp(colony: Colony, path: string[]): void {
        let op = new MapScoutOperation(path);
        colony.operations.addOperation(op);
    }

    private static getPath(colony: Colony, room: string): string[] {
        let path = Game.map.findRoute(colony.nest.roomName, room);
        if (path == -2)
            return [];
        return path.map(p => p.room);
    }
    
    private static sortRooms(rooms: { room: string, distance: number }[]): string[] {
        return rooms.sort((a, b) => a.distance - b.distance).map(p => p.room);
    }

    private static getRooms(range: number) {
        let rooms: { room: string, distance: number }[] = [];
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];
            let r = global.empire.map.getRoomsAround(c.nest.roomName, range);
            for (var j = 0; j < r.length; j++) {
                let skip = false;
                for (var k = 0; k < rooms.length; k++) {
                    if (rooms[k].room == r[j].room) {
                        skip = true;
                        if (rooms[k].distance > r[j].distance)
                            rooms[k] = r[j];
                        break;
                    }
                }
                if (!skip)
                    rooms.push(r[j]);
            }
        }
        return rooms;
    }
}

export class WorldMap {
    public static fromMemory(memory: WorldMapMemory): WorldMap {
        let map = new this();
        for (let key in memory.rooms)
            map.rooms[key] = RoomDetails.fromMemory(memory.rooms[key]);
        return map;
    }

    public rooms: { [name: string]: RoomDetails } = {};

    public getUnscoutedAround(originRoomName: string, pathRange: number, maxAge: number = 5000): string[] {
        let rooms = this.getRoomsAround(originRoomName, pathRange).map(p => p.room);
        let unscouted = [];
        for (var i = 0; i < rooms.length; i++) {
            if (!this.rooms[rooms[i]])
                unscouted.push(rooms[i]);
            else if (!this.rooms[rooms[i]].scoutedBy && (!this.rooms[rooms[i]].tickScouted || Game.time - this.rooms[rooms[i]].tickScouted >= maxAge))
                unscouted.push(rooms[i]);
        }
        return unscouted;
    }

    public getScoutedAround(originRoomName: string, pathRange: number, maxAge: number = 15000): string[] {
        let rooms = this.getRoomsAround(originRoomName, pathRange).map(p => p.room);
        let scouted = [];
        for (var i = 0; i < rooms.length; i++) {
            if (!this.rooms[rooms[i]])
                continue;
            else if (Game.time - this.rooms[rooms[i]].tickScouted <= maxAge)
                scouted.push(rooms[i]);
        }
        return scouted;
    }

    public getRoomsAround(originRoomName: string, pathRange: number): {room: string, distance: number}[] {
        let distance = 1;
        let minPath = 0;
        if (pathRange > 15)
            pathRange = 15;
        let rooms = [];
        while (minPath < pathRange) {
            let currentMin = 100;
            for (var x = -distance; x <= distance; x++) {                
                for (var y = -distance; y <= distance; y++) {
                    if (x == 0 && y == 0) continue;
                    let r = RoomHelper.transformRoom(originRoomName, { x: x, y: y });
                    let path = Game.map.findRoute(originRoomName, r);
                    if (path == -2)
                        continue;
                    else if (path.length <= pathRange) {
                        rooms.push({ room: r, distance: path.length });
                        if (path.length < currentMin) {
                            currentMin = path.length;
                        }
                    }
                }
            }
            distance++;
            minPath = currentMin;
        }
        return rooms;
    }

    public addRoom(name: string): void {
        if (this.rooms[name]) return;
        this.rooms[name] = new RoomDetails(name);
    }

    public scoutRoom(room: Room): void {
        if (!this.rooms[room.name])
            this.rooms[room.name] = this.newRoomDetails(room);
        
        let details = this.rooms[room.name];
        details.tickScouted = Game.time;
        details.scoutedBy = undefined;

        details.controlType = this.getControlType(room, details);
        if (room.controller && room.controller.owner)
            details.owner = room.controller.owner.username;
        if (room.controller && room.controller.reservation)
            details.reservedBy = room.controller.reservation.username;
    }
    
    private newRoomDetails(room: Room): RoomDetails {
        let details = new RoomDetails(room.name);
        let sources = room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++)
            details.sources.push(new SourceDetails(sources[i].id, sources[i].pos.x, sources[i].pos.y));
        let minerals = room.find(FIND_MINERALS);
        for (var i = 0; i < minerals.length; i++)
            details.minerals.push(new MineralDetails(minerals[i].mineralType, minerals[i].id, minerals[i].pos.x, minerals[i].pos.y));
        details.exits = this.getExits(room);
        details.type = RoomHelper.getRoomType(room);
        return details;
    }

    private getExits(room: Room): ExitConstant[] {
        let exits = [];
        if (room.find(FIND_EXIT_TOP).length > 0)
            exits.push(FIND_EXIT_TOP);
        if (room.find(FIND_EXIT_RIGHT).length > 0)
            exits.push(FIND_EXIT_RIGHT);
        if (room.find(FIND_EXIT_BOTTOM).length > 0)
            exits.push(FIND_EXIT_BOTTOM);
        if (room.find(FIND_EXIT_LEFT).length > 0)
            exits.push(FIND_EXIT_LEFT);
        return exits;
    }

    private getControlType(room: Room, details: RoomDetails): RoomControlType {
        if (details.miningInfo)
            return RoomControlType.Extension;
        
        if (room.controller) {
            if (room.controller.my)
                return RoomControlType.Nest;
            else if (room.controller.owner)
                return RoomControlType.EnemyNest;
            else {
                let player = this.getUsernameOfRemoteMine(room);
                if (player)
                    return RoomControlType.EnemyExtension;
            }
        }

        return RoomControlType.Uncontrolled;
    }

    private getUsernameOfRemoteMine(room: Room): string {
        // after eliminating possibility of owned room or mining extension under my control
        if (room.controller && room.controller.reservation && room.controller.reservation.username != Game.spawns[0].owner.username)
            return room.controller.reservation.username; // the room is reserved by another player
        let containers = room.find<StructureContainer>(FIND_STRUCTURES, { filter: p => p.structureType == STRUCTURE_CONTAINER });
        if (containers.length) // some number of containers exist
            return "unknown";
        let sources = room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
            if (sources[i].energy < sources[i].energyCapacity)
                return "unknown";
            let dropped = sources[i].pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (dropped.length)
                return "unknown";
        }
        return undefined;
    }

    public save(): WorldMapMemory {
        let roomMem = {};
        for (let key in this.rooms)
            roomMem[key] = this.rooms[key].save();
        return {
            rooms: roomMem
        };
    }
}

export class RoomDetails {
    public static fromMemory(memory: RoomDetailsMemory): RoomDetails {
        let details = new this(memory.name);
        details.sources = memory.sources.map(p => SourceDetails.fromMemory(p));
        details.minerals = memory.minerals.map(p => MineralDetails.fromMemory(p));
        details.exits = memory.exits;
        details.type = memory.type;
        details.tickScouted = memory.tickScouted;
        details.scoutedBy = memory.scoutedBy;
        details.controlType = memory.controlType;
        details.owner = memory.owner;
        details.reservedBy = memory.reservedBy;
        details.miningInfo = RemoteRoom.fromMemory(memory.miningInfo);
        return details;
    }

    constructor(name: string) {
        this.name = name;
    }

    // static
    public name: string;
    public sources: SourceDetails[] = [];
    public minerals: MineralDetails[] = [];
    public exits: ExitConstant[] = [];
    public type: RoomType;

    // logistics
    /** The tick the room was last scouted. 0 indicates unscouted. */
    public tickScouted: number = 0;
    /** If being scouted, name of creep doing the scouting. */
    public scoutedBy: string;
    
    // variable
    public controlType: RoomControlType;
    public owner: string;
    public reservedBy: string;
    /** The name of another player who is mining this room. */
    // public extensionOf: string; //TODO: implement me

    // mining
    /** If this room is a remote mining extension, this will contain information about it. */
    public miningInfo: RemoteRoom;

    
    public getDistanceToNearestColony(): number {
        let dist = 1000;
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];
            let path = Game.map.findRoute(this.name, c.nest.roomName);
            if (path == -2)
                continue;
            if (path.length < dist)
                dist = path.length;            
        }
        return dist;
    }

    public getNearestColony(): Colony {
        let dist = 1000;
        let colony: Colony;
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];
            let path = Game.map.findRoute(this.name, c.nest.roomName);
            if (path == -2)
                continue;
            if (path.length < dist) {
                dist = path.length;
                colony = c;
            }
        }
        return colony;
    }

    public save(): RoomDetailsMemory {
        return {
            name: this.name,
            sources: this.sources.map(p => p.save()),
            minerals: this.minerals.map(p => p.save()),
            exits: this.exits,
            type: this.type,
            tickScouted: this.tickScouted,
            scoutedBy: this.scoutedBy,
            controlType: this.controlType,
            owner: this.owner,
            reservedBy: this.reservedBy,
            miningInfo: this.miningInfo.save()
        };
    }
}



export class SourceDetails {
    public static fromMemory(memory: SourceDetailsMemory): SourceDetails {
        return new this(memory.id, memory.x, memory.y);
    }

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    public id: string;
    public x: number;
    public y: number;

    public save(): SourceDetailsMemory {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    }
}

export class MineralDetails {
    public static fromMemory(memory: MineralDetailsMemory): MineralDetails {
        return new this(memory.type, memory.id, memory.x, memory.y);
    }

    constructor(type: MineralConstant, id: string, x: number, y: number) {
        this.type = type;
        this.id = id;
        this.x = x;
        this.y = y;
    }

    public type: MineralConstant;
    public id: string;
    public x: number;
    public y: number;

    public save(): MineralDetailsMemory {
        return {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y
        };
    }
}

export enum RoomControlType {
    Nest,
    Extension,
    EnemyNest,
    EnemyExtension,
    Uncontrolled
}
