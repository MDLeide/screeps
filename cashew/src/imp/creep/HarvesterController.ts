import { CreepController } from "../../lib/creep/CreepController";

export class HarvesterController extends CreepController {
    public static fromMemory(memory: HarvesterControllerMemory): HarvesterController {
        var controller = new this(memory.containerId, memory.sourceId);
        controller.arrived = memory.arrived;
        return controller;
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

    protected onLoad(creep: Creep): void {
        this.container = Game.getObjectById<StructureContainer>(this.containerId);
        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
        if (this.arrived) {
            this.harvest(creep);
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

    private moving(creep: Creep) {
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
            sourceId: this.sourceId
        };
    }

}

export interface HarvesterControllerMemory extends CreepControllerMemory {
    arrived: boolean;
    containerId: string;
    sourceId: string;
}
