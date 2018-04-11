import { Colony } from "lib/colony/Colony";
import { RoomDetails } from "lib/empire/WorldMap";
import { RoomType } from "lib/util/RoomHelper";
import { Calculator } from "lib/util/Calculator";

export class RemoteMiningPlanner {
    public static getAssignmentsForColony(colony: Colony): RoomDetails[] {
        let details = [];
        for (let key in global.empire.map.rooms) {
            let d = global.empire.map.rooms[key];
            if (d.miningInfo && d.miningInfo.owner && d.miningInfo.owner == colony.name)
                details.push(d);
        }
        return details;
    }

    public static updateMiningAssignments(range: number): void {
        for (let key in global.empire.map.rooms)
            global.empire.map.rooms[key].miningInfo = undefined;
        let assignments = this.getAssignments(range);
        for (let colonyName in assignments) {
            for (var i = 0; i < assignments[colonyName].length; i++) {
                let details = global.empire.map.rooms[assignments[colonyName][i]];
                let remoteRoom = new RemoteRoom(assignments[colonyName][i]);
                for (var j = 0; j < details.sources.length; j++)
                    remoteRoom.sourceIds.push(details.sources[j].id);
                remoteRoom.owner = colonyName;
            }
        }
    }

    private static getAssignments(range: number): { [colony: string]: string[] } {
        let assignments = {};
        let scores = RemoteMiningPlanner.getScores(range);
        let uniqueRooms = RemoteMiningPlanner.getUniqueRooms(scores);
        for (var i = 0; i < uniqueRooms.length; i++) {
            let highScore = 0;
            let colony: string;
            for (let key in scores) {
                for (var j = 0; j < scores[key].length; j++) {
                    if (scores[key][i].room != uniqueRooms[i])
                        continue;
                    if (scores[key][i].score > highScore) {
                        highScore = scores[key][i].score;
                        colony = key;
                    }
                }
            }
            if (colony) {
                if (!assignments[colony])
                    assignments[colony] = [];
                assignments[colony].push(uniqueRooms[i]);
            }
        }
        return assignments;
    }

    private static getUniqueRooms(scores: { [colony: string]: { room: string, score: number }[] }): string[] {
        let rooms = [];

        for (let key in scores) {
            for (var i = 0; i < scores[key].length; i++) {
                if (rooms.indexOf(scores[key][i]) >= 0)
                    continue;
                rooms.push(scores[key][i]);
            }
        }

        return rooms;
    }

    private static getScores(range: number): { [colony: string]: { room: string, score: number }[] } {
        let results = {};
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];
            let scores = RemoteMiningPlanner.getColonyScores(c, range);
            results[c.name] = scores;
        }
        return results;
    }

    private static getColonyScores(colony: Colony, range: number): { room: string, score: number }[] {
        let rooms = global.empire.map.getScoutedAround(colony.nest.roomName, range);
        let scores = [];
        for (var i = 0; i < rooms.length; i++) {
            let score = RemoteMiningPlanner.scoreRoom(colony, global.empire.map.rooms[rooms[i]]);
            scores.push({ room: rooms[i], score: score });
        }
        return scores;
    }

    private static scoreRoom(colony: Colony, roomDetails: RoomDetails): number {
        if (roomDetails.type != RoomType.Standard)
            return 0;

        let score = 0;
        for (var i = 0; i < roomDetails.sources.length; i++) {
            let s = roomDetails.sources[i];
            let pos = new RoomPosition(s.x, s.y, roomDetails.name);
            score += Calculator.calculateSourceProfit(colony.nest.spawners[0].spawn.pos, pos, true, false, 50).profit;
        }

        return score;
    }
}

export class RemoteRoom {
    public static fromMemory(memory: RemoteRoomMemory): RemoteRoom {
        let room = new this(memory.name);
        room.sourceIds = memory.sourceIds;
        room.owner = memory.owner;
        return room;
    }

    constructor(roomName: string) {
        this.name = roomName;
    }

    public name: string;
    /** The name of the colony mining this room. */
    public owner: string;
    public sourceIds: string[] = [];

    public load(): void {
    }
    
    public save(): RemoteRoomMemory {
        return {
            name: this.name,
            owner: this.owner,
            sourceIds: this.sourceIds
        };
    }
}


