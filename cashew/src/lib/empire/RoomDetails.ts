import { RoomHelper } from "../util/RoomHelper";
import { NestMap } from "../map/NestMap";
import { Colony } from "lib/colony/Colony";

export class Map {

}

export class RoomDetails {
    public name: string;
    public sources: number;
    /** The tick the room was scouted. */
    public tickScouted: number;
    public exits: ExitConstant[];
    public owner: string;
    public reservedBy: string;
    public nestMap: NestMap;
    /** True if the room shares a border with a player-owned room. */
    public bordersPlayer: boolean;
    /** True if the room exits to a player-owned room. */
    public exitsToPlayer: boolean;
    /** If this room is a remote mining extension, this is the Colony that owns it. */
    public extensionOf: Colony;

    /** How old the scouting report is. */
    public get age(): number {
        return Game.time - this.tickScouted;
    }
    public get isSourceKeeper(): boolean {
        return RoomHelper.isSourceKeeperRoom(this.name);
    }

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
}
