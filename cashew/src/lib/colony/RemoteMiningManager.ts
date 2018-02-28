import { RoomHelper } from "../util/RoomHelper";

export class RemoteMiningManager {


    public rooms: RemoteRoom[];

    public initialize(nestRoom: string): void {

    }

    public getClosestUnscoutedRoom(currentRoomName: string): string {
        let min: number = 100;
        let room: string;

        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].scouted || this.rooms[i].beingScouted || this.rooms[i].unreachable)
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

}

export class RemoteRoom {
    constructor(roomName: string) {
        this.name = roomName;
    }

    public name: string;
    public remoteSources: RemoteSource[];
    public scouted: boolean;
    public beingScouted: boolean;
    public unreachable: boolean;
    public get profitable(): boolean {
        if (!this.remoteSources || !this.remoteSources.length)
            return false;
        for (var i = 0; i < this.remoteSources.length; i++) {
            if (this.remoteSources[i].profitable)
                return true;
        }
        return false;
    }
    public get mined(): boolean {
        if (!this.remoteSources || !this.remoteSources.length)
            return false;
        for (var i = 0; i < this.remoteSources.length; i++) 
            if (!this.remoteSources[i].mined)
                return false;
        return true;
    }
}

export class RemoteSource {
    constructor(source: Source) {
        this.source = source;
        this.sourceId = source.id;
    }
    
    public sourceId: string;
    public containerId: string;
    public containerPosition: { x: number, y: number };
    public profitable: boolean;
    public mined: boolean;

    public source: Source;    
    public container: StructureContainer;
    
}
