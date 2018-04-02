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
        controller.didMove = memory.didMove;
        if (memory.lastPos)
            controller.lastPos = new RoomPosition(memory.lastPos.x, memory.lastPos.y, memory.lastPos.roomName);
        return CreepController.fromMemory(memory, controller);
    }

    constructor(standLocation: { x: number, y: number }, waitLocation: { x: number, y: number }, pathA: boolean, linkId: string) {
        super(CREEP_CONTROLLER_FILLER);
        this.standLocation = standLocation;
        this.waitLocation = waitLocation;
        this.onPathA = pathA;
        this.linkId = linkId;
    }

    /** Indicates the creep is not yet needed inside the extension bank. She will wait at the designated wait position. This property must be set externally by an Operation or other higher-level controller. */
    public waiting: boolean = true;
    /** Indicates the creep should start moving through the bank filling extensions. This property needs to be set from an Operation or other higher-level controller. */
    public fill: boolean;

    /** Indicates the creep is on Path A, otherwise, it is on Path B. */
    public onPathA: boolean;
    /** Indicates the creep is standing at its home position, next to the link. */
    public atHome: boolean;    
    /** Indicates the creep is on his way to either the stand or wait location. */
    public enRoute: boolean = true;
    /** Indicates the creep is ready to fill extensions. */
    public readyToFill: boolean;

    /** True if the creep executed a move order on the last Execute phase. */
    public didMove: boolean;
    /** The position of the creep in the previous tick. */
    public lastPos: RoomPosition;

    public waitLocation: { x: number, y: number };
    public standLocation: { x: number, y: number };

    public pathA: DirectionConstant[] = [6, 4, 4, 2, 2, 2, 2, 8, 8, 6]
    public pathB: DirectionConstant[] = [2, 8, 8, 6, 6, 6, 6, 4, 4, 2]
    public pathIndex: number = 0;
        
    public linkId: string
    public link: StructureLink;

    protected onLoad(): void {
        if (this.linkId)
            this.link = Game.getObjectById<StructureLink>(this.linkId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.enRoute && creep.pos.x == this.standLocation.x && creep.pos.y == this.standLocation.y) {
            this.atHome = true;
            this.enRoute = false;
        }

        this.readyToFill = creep.carry.energy >= creep.carryCapacity * .6;

        if (this.didMove) {
            this.didMove = false;
            if (creep.pos.x == this.lastPos.x && creep.pos.y == this.lastPos.y) {
                this.pathIndex--;
            } else {
                let path = this.onPathA ? this.pathA : this.pathB;
                if (this.pathIndex >= path.length) {
                    this.pathIndex = 0;
                    this.onPathA = !this.onPathA;
                    this.atHome = true;
                    this.fill = false;
                }
            }
        }
    }

    protected onExecute(creep: Creep): void {
        if (this.enRoute)
            return this.handleEnroute(creep);

        if (this.atHome)
            this.handleAtHome(creep);

        if (this.fill)
            this.handleFill(creep);
    }

    private handleEnroute(creep: Creep): void {
        if (this.waiting)
            creep.moveTo(this.waitLocation.x, this.waitLocation.y);
        else
            creep.moveTo(this.standLocation.x, this.standLocation.y);
    }

    private handleAtHome(creep: Creep): void {
        if (this.link && creep.carry.energy < creep.carryCapacity)
            creep.withdraw(this.link, RESOURCE_ENERGY);

        this.fillSurrondingExtensions(creep);
        //let extensions = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity });
        //for (var i = 0; i < extensions.length; i++)
        //    creep.transfer(extensions[i], RESOURCE_ENERGY);
        
        //if (extensions.length)
        //    creep.transfer(extensions[0], RESOURCE_ENERGY);  
    }

    private handleFill(creep: Creep): void {
        if (creep.carry.energy > 0) {
            if (this.fillSurrondingExtensions(creep) <= 1)            
                this.moveAhead(creep);            
        } else {
            this.moveAhead(creep);
        }
    }

    private fillSurrondingExtensions(creep: Creep): number {
        let extensions = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.energy < struct.energyCapacity });
        if (extensions.length)        
            creep.transfer(extensions[0], RESOURCE_ENERGY);
        return extensions.length;
    }

    private moveAhead(creep: Creep): void {
        if (this.onPathA) {
            this.moveOnPath(creep, this.pathA);          
        } else {
            this.moveOnPath(creep, this.pathB);
        }
    }

    private moveOnPath(creep: Creep, path: DirectionConstant[]): void {
        if (creep.move(path[this.pathIndex]) == OK) {
            this.didMove = true;
            this.lastPos = creep.pos;
            this.pathIndex++;
            this.atHome = false;
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
            readyToFill: this.readyToFill,
            didMove: this.didMove,
            lastPos: this.lastPos
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
    didMove: boolean;
    lastPos: RoomPosition;
}
