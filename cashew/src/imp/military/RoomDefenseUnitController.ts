import { UnitController } from "lib/military/UnitController";
import { Unit } from "lib/military/Unit";

export class RoomDefenseUnitController extends UnitController {
    public static fromMemory(memory: RoomDefenseUnitControllerMemory): RoomDefenseUnitController {
        let controller = new this(memory.roomName);
        return UnitController.fromMemory(memory, controller) as RoomDefenseUnitController;
    }


    constructor(roomName: string) {
        super(UNIT_CONTROLLER_ROOM_DEFENSE);
        this.roomName = roomName;
        this.room = Game.rooms[roomName];
    }


    public roomName: string;
    public room: Room;


    public load(): void {
        this.room = Game.rooms[this.roomName];
    }

    public update(unit: Unit): void {        
    }
    
    public execute(unit: Unit): void {
        if (!this.room) {
            unit.moveTo(new RoomPosition(25, 25, this.roomName));
        } else {
            let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) {
                let pos = unit.getAveragePosition();
                let nearest: Creep;
                let distance: number = 100;
                for (var i = 0; i < hostiles.length; i++) {
                    let d = pos.getRangeTo(hostiles[i]);
                    if (d < distance) {
                        distance = d;
                        nearest = hostiles[i];
                    }
                }
                if (nearest) {
                    unit.attack(nearest);
                    unit.rangedAttack(nearest);
                    unit.moveTo(nearest);
                }
            }
        }

        let damage = 0;
        let mostDamaged: Creep;
        for (var i = 0; i < unit.members.length; i++) {
            let creep = unit.members[i];
            let d = creep.hitsMax - creep.hits;
            if (d > damage) {
                damage = d;
                mostDamaged = creep;
            }
        }

        if (mostDamaged)
            unit.healOrRangedHeal(mostDamaged, true);        
    }

    public cleanup(unit: Unit): void {
    }
}

export interface RoomDefenseUnitControllerMemory extends UnitControllerMemory {
    roomName: string;
}
