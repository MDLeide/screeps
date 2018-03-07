import { CreepController } from "../../lib/creep/CreepController";

export class FillerController extends CreepController {
    public static fromMemory(memory: FillerControllerMemory): CreepController {
        let controller = new this(memory.standLocation, memory.onPathA, memory.linkId);
        controller.pathIndex = memory.pathIndex;
        controller.atHome = memory.atHome;
        controller.enRoute = memory.enRoute;
        controller.moving = memory.moving;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(standLocation: {x: number, y: number}, pathA: boolean, linkId: string) {
        super(CREEP_CONTROLLER_FILLER);
        this.standLocation = standLocation;
        this.onPathA = pathA;
        this.linkId = linkId;
    }


    public pathA: number[] = [6, 4, 4, 2, 2, 2, 2, 8, 8, 6]
    public pathB: number[] = [2, 8, 8, 6, 6, 6, 6, 4, 4, 2]
    public standLocation: { x: number, y: number };    
    public onPathA: boolean;
    public pathIndex: number = 0;
    public linkId: string
    public link: StructureLink;
    public atHome: boolean;
    public enRoute: boolean = true;
    public moving: boolean; 
    
    protected onLoad(): void {
        if (this.linkId)
            this.link = Game.getObjectById<StructureLink>(this.linkId);
    }

    protected onUpdate(creep: Creep): void { }

    protected onExecute(creep: Creep): void {
        if (this.enRoute) {
            if (creep.pos.x == this.standLocation.x && creep.pos.y == this.standLocation.y) {
                this.atHome = true;
                this.enRoute = false;
            } else {
                creep.moveTo(this.standLocation.x, this.standLocation.y);
                return;
            }
        }

        if (this.atHome) {
            if (this.link && creep.carry.energy < creep.carryCapacity)
                creep.withdraw(this.link, RESOURCE_ENERGY);

            let extensions = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity });
            if (extensions.length) {
                creep.transfer(extensions[0], RESOURCE_ENERGY);
                this.moving = true;
                if (extensions.length == 1)
                    this.moveAhead(creep);
            }
        } else if (creep.carry.energy > 0) {
            let extensions = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity });
            if (extensions.length) {
                creep.transfer(extensions[0], RESOURCE_ENERGY);
                if (extensions.length <= 1)
                    this.moveAhead(creep);
            } else {
                this.moveAhead(creep);
            }
        } else {
            this.moveAhead(creep);
        }
    }

    private moveAhead(creep: Creep): void {
        if (this.onPathA) {
            creep.move(this.pathA[this.pathIndex] as DirectionConstant);
            this.pathIndex++;
            this.atHome = false;

            if (this.pathIndex >= this.pathA.length) {
                this.pathIndex = 0;
                this.onPathA = false;
                this.atHome = true;
            }
        } else {
            creep.move(this.pathB[this.pathIndex] as DirectionConstant);
            this.pathIndex++;
            this.atHome = false;

            if (this.pathIndex >= this.pathB.length) {
                this.pathIndex = 0;
                this.onPathA = true;
                this.atHome = true;
            }
        }
    }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): FillerControllerMemory {
        return {
            type: this.type,
            standLocation: this.standLocation,
            onPathA: this.onPathA,
            pathIndex: this.pathIndex,
            linkId: this.linkId,
            atHome: this.atHome,
            enRoute: this.enRoute,
            moving: this.moving
        };
    }
}

export interface FillerControllerMemory extends CreepControllerMemory {
    standLocation: { x: number, y: number };
    onPathA: boolean;
    pathIndex: number;
    linkId: string    
    atHome: boolean;
    enRoute: boolean;
    moving: boolean;
}
