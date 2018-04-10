import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { FillerController } from "../../creep/FillerController";


export class ExtensionFillOperation extends Operation {
    public static fromMemory(memory: ExtensionFillMemory): ExtensionFillOperation {
        let op = new ExtensionFillOperation();
        op.linkId = memory.linkId;
        op.homeA = memory.homeA;
        op.homeB = memory.homeB;
        op.waitA = memory.waitA;
        op.waitB = memory.waitB;
        op.pathAIndex = memory.pathAIndex;
        op.pathBIndex = memory.pathBIndex;
        op.creepsInMotion = memory.creepsInMotion;
        op.creepAName = memory.creepAName;
        op.creepBName = memory.creepBName;
        op.waitingCreepAName = memory.waitingCreepAName;
        op.waitingCreepBName = memory.waitingCreepBName;
        if (memory.previousA)
            op.previousA = new RoomPosition(memory.previousA.x, memory.previousA.y, memory.previousA.roomName);
        if (memory.previousB)
            op.previousB = new RoomPosition(memory.previousB.x, memory.previousB.y, memory.previousB.roomName);
        return Operation.fromMemory(memory, op) as ExtensionFillOperation;
    }

    constructor() {
        super(OPERATION_EXTENSION_FILL, []);
        this.priority = 10;
    }

    public creepA: Creep;    
    public creepB: Creep;
    public waitingCreepA: Creep;
    public waitingCreepB: Creep;
    public link: StructureLink;
    
    public linkId: string;
    public homeA: { x: number, y: number };
    public homeB: { x: number, y: number };
    public waitA: { x: number, y: number };
    public waitB: { x: number, y: number };
    public creepAName: string;
    public creepBName: string;
    public waitingCreepAName: string;
    public waitingCreepBName: string;
    public creepsInMotion: boolean;
    public pathAIndex: number = 0;
    public pathBIndex: number = 0;
    public previousA: RoomPosition;
    public previousB: RoomPosition;

    public pathA: DirectionConstant[] = [6, 4, 4, 2, 2, 2, 2, 8, 8, 6];
    public pathB: DirectionConstant[] = [2, 8, 8, 6, 6, 6, 6, 4, 4, 2];


    public assignCreep(assignment: Assignment, creepName: string): boolean {
        if (!super.assignCreep(assignment, creepName))
            return false;

        this.assign(creepName);

        return true;
    }

    public assignReplacement(assignment: Assignment, creepName: string): boolean {
        if (!super.assignReplacement(assignment, creepName))
            return false;

        this.assign(creepName);

        return true;
    }

    private assign(creepName: string): void {
        if (!this.creepAName) {
            this.creepAName = creepName;
            return;
        }
        if (!this.creepBName) {
            this.creepBName = creepName;
            return;
        }
        if (!this.waitingCreepAName) {
            this.waitingCreepAName = creepName;
            return;
        }
        if (!this.waitingCreepBName) {
            this.waitingCreepBName = creepName;
            return;
        }
    }

    public onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() >= 1) {
            colony.resourceManager.extensionsManagedDirectly = true;
            return StartStatus.Started;
        }
        return StartStatus.TryAgain;
    }

    public onInit(colony: Colony): InitStatus {
        this.linkId = colony.resourceManager.structures.extensionLinkId;
        let block = colony.nest.nestMap.extensionBlock;
        this.homeA = block.getStandALocation();
        this.homeB = block.getStandBLocation();
        this.waitA = block.getWaitALocation();
        this.waitB = block.getWaitBLocation();

        let body = BodyRepository.hauler();
        body.maxCompleteScalingSections = 8;
        let dist = colony.resourceManager.structures.extensionLink.pos.getRangeTo(colony.nest.spawners[0].spawn);
        let spawnTime = body.getBody(60 * 200).length * 3;
        let leadTime = (spawnTime + dist) * 1.1;
        this.assignments.push(new Assignment(undefined, body, undefined, leadTime));
        this.assignments.push(new Assignment(undefined, body, undefined, leadTime));

        return InitStatus.Initialized;
    }

    public onFinish(colony: Colony): boolean {
        colony.resourceManager.extensionsManagedDirectly = false;
        return true;
    }

    public isFinished(colony: Colony): boolean {        
        return false;
    }
    
    protected onCancel(colony: Colony): void {
    }

    protected onLoad(): void {
        this.link = Game.getObjectById<StructureLink>(this.linkId);
        if (this.creepAName) this.creepA = Game.creeps[this.creepAName];
        if (this.creepBName) this.creepB = Game.creeps[this.creepBName];
        if (this.waitingCreepAName) this.waitingCreepA = Game.creeps[this.waitingCreepAName];
        if (this.waitingCreepBName) this.waitingCreepB = Game.creeps[this.waitingCreepBName];
    }

    protected onUpdate(colony: Colony): void {
        this.checkMoves();        
        if (!this.creepA) {
            if (this.waitingCreepA) {
                this.creepA = this.waitingCreepA;
                this.creepAName = this.waitingCreepAName;
                this.waitingCreepA = null;
                this.waitingCreepAName = null;
            } else if (this.waitingCreepB) {
                this.creepA = this.waitingCreepB;
                this.creepAName = this.waitingCreepBName;
                this.waitingCreepB = null;
                this.waitingCreepBName = null;
            }
            this.creepsInMotion = false;
        }
        if (!this.creepB) {
            if (this.waitingCreepA) {
                this.creepB = this.waitingCreepA;
                this.creepBName = this.waitingCreepAName;
                this.waitingCreepA = null;
                this.waitingCreepAName = null;
            } else if (this.waitingCreepB) {
                this.creepB = this.waitingCreepB;
                this.creepBName = this.waitingCreepBName;
                this.waitingCreepB = null;
                this.waitingCreepBName = null;
            }
            this.creepsInMotion = false;
        }

        if (!this.creepsInMotion) {
            this.pathAIndex = 0;
            this.pathBIndex = 0;
        }
    }

    protected onExecute(colony: Colony): void {        
        this.checkWaitingPositions();

        if (this.creepsInMotion) {
            if (this.creepsStillInMotion()) {
                this.moveAndFillCreeps();
                return;
            } else {
                this.creepsInMotion = false;
                this.swapCreeps();
            }
        } else {
            this.checkHomePositions();
        }

        if (this.manageCreepsAtHome()) {
            this.creepsInMotion = true;
            this.moveCreepsForward();
        }
    }
    
    protected onCleanup(colony: Colony): void {
    }

    // manages creeps when they are home. returns true if they should begin filling
    private manageCreepsAtHome(): boolean {
        let homeAEmptyExts = 0;
        let creepACanFill: boolean = false;
        if (this.creepA && this.creepAtHome(true)) {
            if (this.creepA.carry.energy < this.creepA.carryCapacity)
                this.creepA.withdraw(this.link, RESOURCE_ENERGY);
            homeAEmptyExts = this.fillAround(this.creepA);
            if (homeAEmptyExts <= 1 && this.creepA.carry.energy >= this.creepA.carryCapacity / 2)
                creepACanFill = true;
        }

        let homeBEmptyExts = 0;
        let creepBCanFill: boolean = false;
        if (this.creepB && this.creepAtHome(false)) {
            if (this.creepB.carry.energy < this.creepB.carryCapacity)
                this.creepB.withdraw(this.link, RESOURCE_ENERGY);
            homeBEmptyExts = this.fillAround(this.creepB);
            if (homeBEmptyExts <= 1 && this.creepB.carry.energy >= this.creepB.carryCapacity / 2)
                creepBCanFill = true;
        }

        if (creepACanFill && creepBCanFill) {
            let allEmptyExtCount = this.link.room.find<StructureExtension>(FIND_MY_STRUCTURES, { filter: p => p.structureType == STRUCTURE_EXTENSION && p.energy < p.energyCapacity }).length;
            if (allEmptyExtCount - (homeAEmptyExts + homeBEmptyExts) > 0)
                return true;
        }

        return false;
    }

    // makes sure active creeps are at or moving to their home positions
    private checkHomePositions(): void {
        if (this.creepA && !this.creepAtHome(true))
            this.creepA.moveTo(this.homeA.x, this.homeA.y);
        if (this.creepB && !this.creepAtHome(false))
            this.creepB.moveTo(this.homeB.x, this.homeB.y);
    }

    // makes sure waiting creeps are at or moving to their wait positions
    private checkWaitingPositions(): void {
        if (this.waitingCreepA && !this.creepAtWait(true))
            this.waitingCreepA.moveTo(this.waitA.x, this.waitA.y);
        if (this.waitingCreepB && !this.creepAtWait(false))
            this.waitingCreepB.moveTo(this.waitB.x, this.waitB.y);
    }

    // swaps creep A and B
    private swapCreeps(): void {
        let temp = this.creepA;
        let tempName = this.creepAName;
        this.creepA = this.creepB;
        this.creepAName = this.creepBName;
        this.creepB = temp;
        this.creepBName = tempName;
    }

    // determines if creeps are still moving around the block
    private creepsStillInMotion(): boolean {
        // home positions are inverted since they are moving towards the opposite side
        return this.creepA && this.pathAIndex != 0 && this.creepB && this.pathBIndex != 0;
    }

    // fills extensions immediately surronding both creeps and moves them along the path if done filling
    private moveAndFillCreeps(): void {
        if (this.creepA)
            this.moveAndFill(true);
        if (this.creepB)
            this.moveAndFill(false);
    }

    // fills extensions immediately surronding the creep and moves it along the path if done filling
    private moveAndFill(a: boolean): void {
        let creep = a ? this.creepA : this.creepB;
        let surronding = this.fillAround(creep);
        if (surronding <= 1 || creep.carry.energy == 0)
            this.moveForward(a);
    }

    // moves both creeps forward along their path
    private moveCreepsForward(): void {
        this.moveForward(true);
        this.moveForward(false);
    }

    // moves a creep forward along its path
    private moveForward(a: boolean): void {
        let creep = a ? this.creepA : this.creepB;
        let path = a ? this.pathA : this.pathB;
        let index = a ? this.pathAIndex : this.pathBIndex;
        if (a) this.previousA = creep.pos;
        else this.previousB = creep.pos;
        creep.move(path[index]);
    }

    // checks if a creep successfuly moved last tick and updates the path index
    private checkMoves(): void {
        if (this.creepA && this.previousA) {
            if (this.creepA.pos.x != this.previousA.x && this.creepA.pos.y != this.previousA.y) {
                this.pathAIndex++;
                if (this.pathAIndex >= this.pathA.length)
                    this.pathAIndex = 0;
            }
        }

        if (this.creepB && this.previousB) {
            if (this.creepB.pos.x != this.previousB.x && this.creepB.pos.y != this.previousB.y) {
                this.pathBIndex++;
                if (this.pathBIndex >= this.pathB.length)
                    this.pathBIndex = 0;
            }
        }

        this.previousB = undefined;
        this.previousA = undefined;
    }
        
    // Returns the number of empty extensions within a range of 1 of the creep
    private fillAround(creep: Creep): number {
        let ext = creep.pos.findInRange<StructureExtension>(FIND_MY_STRUCTURES, 1, { filter: p => p.structureType == STRUCTURE_EXTENSION && p.energy < p.energyCapacity });
        if (ext.length) {
            creep.transfer(ext[0], RESOURCE_ENERGY);
            return ext.length;
        }
        return 0;
    }

    private creepAtHome(a: boolean): boolean {
        if (a) return this.positionsMatch(this.creepA, this.homeA);
        else return this.positionsMatch(this.creepB, this.homeB);
    }

    private creepAtWait(a: boolean): boolean {
        if (a) return this.positionsMatch(this.waitingCreepA, this.waitA);
        else return this.positionsMatch(this.waitingCreepB, this.waitB);
    }

    private positionsMatch(creep: Creep, pos: { x: number, y: number }): boolean {
        return creep.pos.x == pos.x && creep.pos.y == pos.y;
    }

    public save(): ExtensionFillMemory {
        let mem = super.save() as ExtensionFillMemory;
        mem.creepAName = this.creepAName;
        mem.creepBName = this.creepBName;
        mem.waitingCreepAName = this.waitingCreepAName;
        mem.waitingCreepBName = this.waitingCreepBName;
        mem.homeA = this.homeA;
        mem.homeB = this.homeB;
        mem.waitA = this.waitA;
        mem.waitB = this.waitB;
        mem.linkId = this.linkId;
        mem.creepsInMotion = this.creepsInMotion;
        mem.pathAIndex = this.pathAIndex;
        mem.pathBIndex = this.pathBIndex;
        mem.previousA = this.previousA;
        mem.previousB = this.previousB;
        return mem;
    }
}

export interface ExtensionFillMemory extends OperationMemory {
    creepAName: string;
    creepBName: string;
    waitingCreepAName: string;
    waitingCreepBName: string;
    homeA: { x: number, y: number };
    homeB: { x: number, y: number };
    waitA: { x: number, y: number };
    waitB: { x: number, y: number };
    linkId: string;
    creepsInMotion: boolean;
    pathAIndex: number;
    pathBIndex: number;
    previousA: RoomPosition;
    previousB: RoomPosition;
}

//export class ExtensionFillOperation extends ControllerOperation {
//    public static fromMemory(memory: ExtensionFillOperationMemory): Operation {
//        let op = new this();
//        op.linkId = memory.linkId;
//        op.pathAStandLocation = memory.pathAStandLocation;
//        op.pathBStandLocation = memory.pathBStandLocation;
//        op.lastAssignedWasA = memory.lastAssignedWasA;
//        op.AWaitLocation = memory.AWaitLocation;
//        op.BWaitLocation = memory.BWaitLocation;
//        return ControllerOperation.fromMemory(memory, op);
//    }


//    constructor() {
//        super(OPERATION_EXTENSION_FILL, []);
//        this.priority = 8;
//    }

//    public linkId: string
//    public pathAStandLocation: { x: number, y: number };
//    public pathBStandLocation: { x: number, y: number };
//    public AWaitLocation: { x: number, y: number };
//    public BWaitLocation: { x: number, y: number };
//    public lastAssignedWasA: boolean;

//    public isFinished(colony: Colony): boolean {
//        return false;
//    }


//    protected onLoad(): void {
//    }

//    protected onUpdate(colony: Colony): void {
//        this.updateWaiting();

//        if (this.shouldStartFilling(colony))
//            this.startFilling();
//    }

//    protected onExecute(colony: Colony): void {
//    }

//    protected onCleanup(colony: Colony): void {
//    }


//    protected onInit(colony: Colony): InitStatus {
//        this.linkId = colony.resourceManager.structures.extensionLinkId;

//        let body = BodyRepository.hauler();
//        body.maxCompleteScalingSections = 8;
//        let block = colony.nest.nestMap.extensionBlock;

//        this.pathAStandLocation = block.getStandALocation();
//        this.pathBStandLocation = block.getStandBLocation();

//        this.AWaitLocation = block.getWaitALocation();
//        this.BWaitLocation = block.getWaitBLocation();

//        let dist = colony.resourceManager.structures.extensionLink.pos.getRangeTo(colony.nest.spawners[0].spawn);
//        let spawnTime = body.getBody(60 * 200).length * 3;
//        let leadTime = spawnTime + dist;
//        leadTime = leadTime * 1.1;

//        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, leadTime));
//        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, leadTime));


//        return InitStatus.Initialized;
//    }

//    protected onStart(colony: Colony): StartStatus {
//        if (this.getFilledAssignmentCount() < 1)
//            return StartStatus.TryAgain;
//        colony.resourceManager.extensionsManagedDirectly = true;
//        return StartStatus.Started;
//    }

//    protected onFinish(colony: Colony): boolean {
//        colony.resourceManager.extensionsManagedDirectly = false;
//        return true;
//    }

//    protected onCancel(colony: Colony): void {
//        colony.resourceManager.extensionsManagedDirectly = false;
//    }


//    protected getController(assignment: Assignment): CreepController {
//        if (this.countActive(true) < 1)
//            return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);

//        if (this.countActive(false) < 1)
//            return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);

//        let waitingA = this.countWaiting(true);
//        let waitingB = this.countWaiting(false);

//        if (waitingA < waitingB) {
//            return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
//        } else if (waitingB < waitingA) {
//            return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);
//        } else {
//            if (this.findOldestActive) {
//                return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
//            } else {
//                return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);
//            }
//        }
//    }


//    private updateWaiting(): void {
//        this.updatePathCreeps(true);
//        this.updatePathCreeps(false);
//    }

//    /** Checks the creeps on the given path to determine if they need to stop waiting. */
//    private updatePathCreeps(pathA: boolean): void {
//        let count = _.sum(this.controllers, (p: FillerController) => p.onPathA == pathA && !p.waiting ? 1 : 0);
//        if (count > 0)
//            return;
//        for (let key in this.controllers) {
//            let c = this.controllers[key] as FillerController;
//            if (c.waiting && c.onPathA == pathA)
//                c.waiting = false;
//        }
//    }

//    private shouldStartFilling(colony: Colony): boolean {
//        let readyToFill = _.sum(this.controllers, (p: FillerController) => p.readyToFill ? 1 : 0);
//        if (readyToFill < 2)
//            return false;

//        if (colony.nest.room.energyAvailable >= colony.nest.room.energyCapacityAvailable)
//            return false;

//        return this.countUnfilledHomeExtensions(colony) == 0;
//    }

//    private countUnfilledHomeExtensions(colony: Colony): number {
//        return this.countAdjacementUnfilledExtensions(new RoomPosition(this.pathAStandLocation.x, this.pathAStandLocation.y, colony.nest.roomName)) +
//            this.countAdjacementUnfilledExtensions(new RoomPosition(this.pathBStandLocation.x, this.pathBStandLocation.y, colony.nest.roomName));
//    }

//    private countAdjacementUnfilledExtensions(pos: RoomPosition): number {
//        return pos.findInRange<StructureExtension>(
//            FIND_MY_STRUCTURES,
//            1,
//            {
//                filter:
//                    s => s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity
//            }).length;
//    }

//    private startFilling(): void {
//        for (let key in this.controllers) {
//            let c = this.controllers[key] as FillerController;
//            if (!c.enRoute && c.atHome && c.readyToFill) {
//                c.fill = true;
//            } else if (c.waiting) { // swap the waiters so they stay with the creep they are supposed to replace
//                c.onPathA = !c.onPathA;
//                c.standLocation = c.onPathA ? this.pathAStandLocation : this.pathBStandLocation;
//                this.lastAssignedWasA = !this.lastAssignedWasA;
//            }
//        }
//    }

//    /** Gets the number of creeps that are waiting and assigned to the provided path. */
//    private countWaiting(pathA: boolean): number {
//        let count = 0;
//        for (let key in this.controllers) {
//            let c = this.controllers[key] as FillerController;
//            if (c.waiting && c.onPathA == pathA)
//                count++;
//        }
//        return count;
//    }

//    private countActive(pathA: boolean): number {
//        let count = 0;
//        for (let key in this.controllers) {
//            let c = this.controllers[key] as FillerController;
//            if (!c.waiting && c.onPathA == pathA)
//                count++;
//        }
//        return count;
//    }

//    /** Finds the oldest active creep. Returns true if he is on PathA, otherwise, on PathB */
//    private findOldestActive(): boolean {
//        let pathA: boolean;
//        let ticksLeft: number = 1500;
//        for (let key in this.controllers) {
//            let c = this.controllers[key] as FillerController;
//            let creep = Game.creeps[key];
//            if (creep && !c.waiting && creep.ticksToLive < ticksLeft) {
//                ticksLeft = creep.ticksToLive;
//                pathA = c.onPathA;
//            }
//        }
//        return pathA;
//    }

//    public save(): ExtensionFillOperationMemory {
//        let mem = super.save() as ExtensionFillOperationMemory;
//        mem.linkId = this.linkId;
//        mem.pathAStandLocation = this.pathAStandLocation;
//        mem.pathBStandLocation = this.pathBStandLocation;
//        mem.AWaitLocation = this.AWaitLocation;
//        mem.BWaitLocation = this.BWaitLocation;
//        mem.lastAssignedWasA = this.lastAssignedWasA;
//        return mem;
//    }
//}

//export interface ExtensionFillOperationMemory extends ControllerOperationMemory {
//    linkId: string
//    pathAStandLocation: { x: number, y: number };
//    pathBStandLocation: { x: number, y: number };
//    AWaitLocation: { x: number, y: number };
//    BWaitLocation: { x: number, y: number };
//    lastAssignedWasA: boolean;
//}
