import { CreepController } from "../../lib/creep/CreepController";

export class HarvesterController extends CreepController {
    public static fromMemory(memory: HarvesterControllerMemory): CreepController {
        var controller = new this(memory.containerId, memory.sourceId);
        controller.arrived = memory.arrived;
        controller.repaired = memory.repaired;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(containerId: string, sourceId: string) {
        super(CREEP_CONTROLLER_HARVESTER);
        this.containerId = containerId;
        this.sourceId = sourceId;
    }

    public container: StructureContainer;
    public source: Source;
    public containerId: string;
    public sourceId: string;
    public arrived: boolean;
    public repaired: boolean;

    protected onLoad(): void {
        this.container = Game.getObjectById<StructureContainer>(this.containerId);
        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {        
        if (this.repaired) {
            this.harvest(creep);
        } else if (this.arrived) {
            if (this.container.hits >= this.container.hitsMax - 10) {
                this.repaired = true;
                this.harvest(creep);
            } else {
                this.repair(creep);
            }
        } else {
            let distance = creep.pos.getRangeTo(this.container);
            if (distance == 0) {                
                this.arrived = true;
                this.harvest(creep);
            } else if (distance == 1) {
                this.nextTile(creep);
            } else {                
                this.moving(creep);
            }
        }      
    }

    protected onCleanup(creep: Creep): void { }

    private repair(creep: Creep): void {
        if (creep.carry.energy >= 25) {
            creep.repair(this.container);
        } else {
            creep.harvest(this.source);
        }
    }

    private moving(creep: Creep): void {        
        creep.moveTo(this.container);
    }

    private nextTile(creep: Creep): void {
        let blockers = this.container.room.lookForAt<LOOK_CREEPS>(LOOK_CREEPS, this.container.pos.x, this.container.pos.y);
        if (blockers.length) {
            for (var i = 0; i < blockers.length; i++)
                global.ucreep.swap(creep, blockers[i]);
        } else {
            creep.moveTo(this.container);
        }
    }

    private harvest(creep: Creep): void {
        creep.harvest(this.source);
        creep.transfer(this.container, RESOURCE_ENERGY);
    }

    protected onSave(): HarvesterControllerMemory {
        return {
            type: this.type,
            arrived: this.arrived,
            containerId: this.containerId,
            sourceId: this.sourceId,
            repaired: this.repaired
        };
    }

}

export interface HarvesterControllerMemory extends CreepControllerMemory {
    arrived: boolean;
    containerId: string;
    sourceId: string;
    repaired: boolean;
}
