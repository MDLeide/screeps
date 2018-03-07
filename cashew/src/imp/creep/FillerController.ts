import { CreepController } from "../../lib/creep/CreepController";

export class FillerController extends CreepController {
    public static fromMemory(memory: FillerControllerMemory): CreepController {
        let controller = new this(memory.standLocation, memory.waitLocation, memory.onPathA, memory.linkId);
        controller.pathIndex = memory.pathIndex;
        controller.atHome = memory.atHome;
        controller.waiting = memory.waiting;
        controller.enRoute = memory.enRoute;
        controller.fill = memory.fill;
        controller.readyToFill = memory.readyToFill;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(standLocation: { x: number, y: number }, waitLocation: { x: number, y: number }, pathA: boolean, linkId: string) {
        super(CREEP_CONTROLLER_FILLER);
        this.standLocation = standLocation;
        this.waitLocation = waitLocation;
        this.onPathA = pathA;
        this.linkId = linkId;
    }


    public onPathA: boolean;
    public pathA: number[] = [6, 4, 4, 2, 2, 2, 2, 8, 8, 6]
    public pathB: number[] = [2, 8, 8, 6, 6, 6, 6, 4, 4, 2]
    public pathIndex: number = 0;
    public waitLocation: { x: number, y: number };
    public standLocation: { x: number, y: number };
        
    public linkId: string
    public link: StructureLink;

    public atHome: boolean;
    public waiting: boolean = true;
    public enRoute: boolean = true;    

    public readyToFill: boolean;
    public fill: boolean;

    protected onLoad(): void {
        if (this.linkId)
            this.link = Game.getObjectById<StructureLink>(this.linkId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.enRoute && creep.pos.x == this.standLocation.x && creep.pos.y == this.standLocation.y) {
            this.atHome = true;
            this.enRoute = false;
        }
        
        if (creep.carry.energy == creep.carryCapacity)
            this.readyToFill = true;
        else
            this.readyToFill = false;
    }

    protected onExecute(creep: Creep): void {
        if (this.enRoute) {
            this.moveToStandLocation(creep);
        }

        if (this.atHome) {
            if (this.link && creep.carry.energy < creep.carryCapacity)
                creep.withdraw(this.link, RESOURCE_ENERGY);

            let extensions = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity });
            if (extensions.length)
                creep.transfer(extensions[0], RESOURCE_ENERGY);            
        }

        if (this.fill) {
            this.doFill(creep);
        }        
    }

    private moveToStandLocation(creep: Creep): void {
        if (this.waiting)
            creep.moveTo(this.waitLocation.x, this.waitLocation.y)
        else
            creep.moveTo(this.standLocation.x, this.standLocation.y);        
    }

    private doFill(creep: Creep) {
        if (creep.carry.energy > 0) {
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
            if (creep.move(this.pathA[this.pathIndex] as DirectionConstant) == OK) {
                this.pathIndex++;
                this.atHome = false;

                if (this.pathIndex >= this.pathA.length) {
                    this.pathIndex = 0;
                    this.onPathA = false;
                    this.atHome = true;
                    this.fill = false;
                }
            }            
        } else {
            if (creep.move(this.pathB[this.pathIndex] as DirectionConstant) == OK) {
                this.pathIndex++;
                this.atHome = false;

                if (this.pathIndex >= this.pathB.length) {
                    this.pathIndex = 0;
                    this.onPathA = true;
                    this.atHome = true;
                    this.fill = false;
                }
            }            
        }
    }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): FillerControllerMemory {
        return {
            type: this.type,
            standLocation: this.standLocation,
            waitLocation: this.waitLocation,            
            onPathA: this.onPathA,
            pathIndex: this.pathIndex,
            linkId: this.linkId,
            atHome: this.atHome,
            waiting: this.waiting,
            enRoute: this.enRoute,
            fill: this.fill,
            readyToFill: this.readyToFill
        };
    }
}

export interface FillerControllerMemory extends CreepControllerMemory {
    standLocation: { x: number, y: number };
    waitLocation: { x: number, y: number };
    onPathA: boolean;
    linkId: string;
    pathIndex: number;    
    atHome: boolean;
    waiting: boolean;
    enRoute: boolean;
    fill: boolean;
    readyToFill: boolean;
}
