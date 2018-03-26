import { RoomHelper } from "../../../lib/util/RoomHelper";

import { BodyRepository } from "../../creep/BodyRepository";
import { Colony } from "../../../lib/colony/Colony";
import { ColonyMonitor } from "../../../lib/colony/ColonyMonitor";
import { Unit } from "../../../lib/military/Unit";

import { MilitaryCalculator } from "../../../lib/util/MilitaryCalculator";

import { StandardFormation } from "../../military/formation/StandardFormation";
import { StandardTargetingTactics } from "../../military/tactics/StandardTargetingTactics";

import { Healer } from "../../creep/military/Healer";
import { Hoplite } from "../../creep/military/Hoplite";
import { Ranger } from "../../creep/military/Ranger";

export class ColonyDefenseMonitor extends ColonyMonitor {
    public static fromMemory(memory: ColonyDefenseMonitorMemory): ColonyDefenseMonitor {
        let monitor = new this();
        for (let key in memory.units)
            monitor.units[key] = Unit.fromMemory(memory.units[key]);
        return ColonyMonitor.fromMemory(memory, monitor) as ColonyDefenseMonitor;
    }

    constructor() {
        super(MONITOR_COLONY_DEFENSE);
    }
    
    public units: { [room: string]: Unit } = {};

    public load(): void {
    }

    public update(colony: Colony): void {
        // this.checkForNewThreats(colony);
        for (let key in this.units)
            this.units[key].update();
    }

    public execute(colony: Colony): void {
        for (let key in this.units) {
            this.controlUnit(key, this.units[key], colony);
            this.units[key].execute();
        }
    }

    public cleanup(colony: Colony): void {
        for (let key in this.units)
            this.units[key].cleanup();
    }

    //todo: this is a mess
    private controlUnit(room: string, unit: Unit, colony: Colony): void {
        if (!unit.rallying) {
            let rallySuccess = false;
            let outterCount = 0;
            let count = 0;
            while (!rallySuccess) {
                let transform = { x: (count < 2 ? 3 : -3), y: (count % 2 == 0 ? 3 : -3) };
                transform.x = transform.x * outterCount;
                transform.y = transform.y * outterCount;
                let pos = RoomHelper.transformRoomPosition(
                    colony.nest.spawners[0].spawn.pos,
                    transform);
                count++;
                if (count > 3) {
                    count = 0;
                    outterCount++;
                }

                if (pos.roomName != colony.nest.roomName)
                    continue;
                rallySuccess = unit.canRallyTo(pos);
                if (rallySuccess)
                    unit.rallyTo(pos);
            }
        }
                
        if (unit.rallying && !unit.rallying.complete) {
            let openPositions = unit.getOpenMembers();
            for (var i = 0; i < openPositions.length; i++) {
                let body = BodyRepository.getBody(openPositions[i].bodyType);
                if (colony.canSpawn(body)) {
                    let result = colony.spawnCreep(body);
                    if (result)
                        unit.assign(openPositions[i], result.name);                    
                }
            }
        }

        if (unit.rallying && unit.rallying.complete) {
            if (unit.position.roomName == room) {
                unit.engage();
                let nearestHostile = MilitaryCalculator.getNearestHostile(unit.position);
                if (nearestHostile)
                    unit.moveTo(nearestHostile);
            } else {
                let pos = new RoomPosition(25, 25, room);
                unit.moveTo(pos);
            }
        }
    }

    private checkForNewThreats(colony: Colony): void {
        for (var i = 0; i < colony.remoteMiningManager.rooms.length; i++) {
            let remoteRoom = colony.remoteMiningManager.rooms[i];
            if (!remoteRoom.active)
                continue;            
                
            let room = Game.rooms[remoteRoom.name];
            if (!room)
                continue;

            let hostiles = room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) {
                if (!this.units[remoteRoom.name]) {
                    let members = [
                        new Hoplite("vanguard"),
                        new Healer("left"),
                        new Ranger("right")
                    ];

                    let unit = new Unit(
                        members,
                        StandardFormation.getFormation(),
                        new StandardTargetingTactics());

                    this.units[remoteRoom.name] = unit;
                }
            } else {
                if (this.units[remoteRoom.name])
                    delete this.units[remoteRoom.name];
            }
        }
    }


    protected getUnitMemory(): { [room: string]: UnitMemory } {
        let mem: { [room: string]: UnitMemory } = {};
        for (let key in this.units)
            mem[key] = this.units[key].save();
        return mem;
    }

    public save(): ColonyDefenseMonitorMemory {
        let mem: ColonyDefenseMonitorMemory = super.save() as ColonyDefenseMonitorMemory;
        mem.units = this.getUnitMemory();
        return mem;
    }
}

export interface ColonyDefenseMonitorMemory extends ColonyMonitorMemory {
    units: { [room: string]: UnitMemory };
}
