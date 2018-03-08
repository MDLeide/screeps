import { MemoryManager } from "../MemoryManager";

export class Cleaner {
    public help(): string {
        return "cleanAll() - performs cleanRoom() on all owned rooms, suicides all creeps, and resets memory </br>" +
            "cleanRoom(roonName) - destroys all structures in a given room";
    }

    public cleanAll(): string {
        for (var key in Game.creeps)
            Game.creeps[key].suicide();

        Memory.creeps = {};
        MemoryManager.initialize();

        for (var key in Game.rooms)
            this.cleanRoom(key);

        Memory.rooms = {};
        return "Finished cleaning.";
    }

    public cleanRoom(roomName: string): void {
        var room = Game.rooms[roomName];
        if (!room) {
            this.log(`room ${roomName} not found.`);
            return;
        }

        var flags = room.find(FIND_FLAGS);
        for (var i = 0; i < flags.length; i++) {
            var f = flags[i];
            if (f.name == "debug")
                continue;
            f.remove();
        }

        let sites = room.find(FIND_MY_CONSTRUCTION_SITES);
        for (var i = 0; i < sites.length; i++) 
            sites[i].remove();
        var structures = room.find(FIND_STRUCTURES);
        for (var i = 0; i < structures.length; i++) {
            if (structures[i].structureType != STRUCTURE_SPAWN)
                structures[i].destroy();
        }

        this.log(`Cleaned room ${roomName}.`)
    }

    private log(msg: string, color: string = "orange") {
        console.log(`<span style='color:${color}'>RoomDebug: ${msg}</span>`);
    }
}
