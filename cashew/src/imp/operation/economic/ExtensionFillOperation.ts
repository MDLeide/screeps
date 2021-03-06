import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { FillerController } from "../../creep/FillerController";

export class ExtensionFillOperation extends ControllerOperation {
    public static fromMemory(memory: ExtensionFillOperationMemory): Operation {
        let op = new this();
        op.linkId = memory.linkId;
        op.pathAStandLocation = memory.pathAStandLocation;
        op.pathBStandLocation = memory.pathBStandLocation;
        op.lastAssignedWasA = memory.lastAssignedWasA;
        op.AWaitLocation = memory.AWaitLocation;
        op.BWaitLocation = memory.BWaitLocation;
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_EXTENSION_FILL, []);
        this.priority = 8;
    }
    
    public linkId: string
    public pathAStandLocation: { x: number, y: number };
    public pathBStandLocation: { x: number, y: number };
    public AWaitLocation: { x: number, y: number };
    public BWaitLocation: { x: number, y: number };
    public lastAssignedWasA: boolean;

    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        this.updateWaiting();
        
        if (this.shouldStartFilling(colony))
            this.startFilling();
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    protected onInit(colony: Colony): InitStatus {
        this.linkId = colony.resourceManager.structures.extensionLinkId;

        let body = BodyRepository.hauler();
        body.maxCompleteScalingSections = 8;
        let block = colony.nest.nestMap.extensionBlock;

        this.pathAStandLocation = block.getStandALocation();
        this.pathBStandLocation = block.getStandBLocation();

        this.AWaitLocation = block.getWaitALocation();
        this.BWaitLocation = block.getWaitBLocation();

        let dist = colony.resourceManager.structures.extensionLink.pos.getRangeTo(colony.nest.spawners[0].spawn);
        let spawnTime = body.getBody(60 * 200).length * 3;
        let leadTime = spawnTime + dist;
        leadTime = leadTime * 1.1;

        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, leadTime));
        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, leadTime));


        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() < 1)
            return StartStatus.TryAgain;
        colony.resourceManager.extensionsManagedDirectly = true;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        colony.resourceManager.extensionsManagedDirectly = false;
        return true;
    }

    protected onCancel(colony: Colony): void {
        colony.resourceManager.extensionsManagedDirectly = false;
    }


    protected getController(assignment: Assignment): CreepController {        
        if (this.countActive(true) < 1)
            return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
        
        if (this.countActive(false) < 1)
            return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);

        let waitingA = this.countWaiting(true);
        let waitingB = this.countWaiting(false);

        if (waitingA < waitingB) {
            return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
        } else if (waitingB < waitingA) {
            return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);
        } else {
            if (this.findOldestActive) {
                return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
            } else {
                return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);
            }
        }
    }


    private updateWaiting(): void {
        this.updatePathCreeps(true);
        this.updatePathCreeps(false);
    }

    /** Checks the creeps on the given path to determine if they need to stop waiting. */
    private updatePathCreeps(pathA: boolean): void {
        let count = _.sum(this.controllers, (p: FillerController) => p.onPathA == pathA && !p.waiting ? 1 : 0);
        if (count > 0)
            return;
        for (let key in this.controllers) {
            let c = this.controllers[key] as FillerController;
            if (c.waiting && c.onPathA == pathA)
                c.waiting = false;
        }
    }
    
    private shouldStartFilling(colony: Colony): boolean {
        let readyToFill = _.sum(this.controllers, (p: FillerController) => p.readyToFill ? 1 : 0);
        if (readyToFill < 2)
            return false;

        if (colony.nest.room.energyAvailable >= colony.nest.room.energyCapacityAvailable)
            return false;

        return this.countUnfilledHomeExtensions(colony) == 0;
    }

    private countUnfilledHomeExtensions(colony: Colony): number {
        return this.countAdjacementUnfilledExtensions(new RoomPosition(this.pathAStandLocation.x, this.pathAStandLocation.y, colony.nest.roomName)) +
            this.countAdjacementUnfilledExtensions(new RoomPosition(this.pathBStandLocation.x, this.pathBStandLocation.y, colony.nest.roomName));
    }

    private countAdjacementUnfilledExtensions(pos: RoomPosition): number {
        return pos.findInRange<StructureExtension>(
            FIND_MY_STRUCTURES,
            1,
            {
                filter:
                    s => s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity
            }).length;
    }

    private startFilling(): void {
        for (let key in this.controllers) {
            let c = this.controllers[key] as FillerController;
            if (!c.enRoute && c.atHome && c.readyToFill) {
                c.fill = true;
            } else if (c.waiting) { // swap the waiters so they stay with the creep they are supposed to replace
                c.onPathA = !c.onPathA;
                c.standLocation = c.onPathA ? this.pathAStandLocation : this.pathBStandLocation;
                this.lastAssignedWasA = !this.lastAssignedWasA;
            }
        }
    }

    /** Gets the number of creeps that are waiting and assigned to the provided path. */
    private countWaiting(pathA: boolean): number {
        let count = 0;
        for (let key in this.controllers) {
            let c = this.controllers[key] as FillerController;
            if (c.waiting && c.onPathA == pathA)
                count++;
        }
        return count;
    }

    private countActive(pathA: boolean): number {
        let count = 0;
        for (let key in this.controllers) {
            let c = this.controllers[key] as FillerController;
            if (!c.waiting && c.onPathA == pathA)
                count++;
        }
        return count;
    }

    /** Finds the oldest active creep. Returns true if he is on PathA, otherwise, on PathB */
    private findOldestActive(): boolean {
        let pathA: boolean;
        let ticksLeft: number = 1500;
        for (let key in this.controllers) {
            let c = this.controllers[key] as FillerController;
            let creep = Game.creeps[key];
            if (creep && !c.waiting && creep.ticksToLive < ticksLeft) {
                ticksLeft = creep.ticksToLive;
                pathA = c.onPathA;
            }
        }
        return pathA;
    }

    public save(): ExtensionFillOperationMemory {
        let mem = super.save() as ExtensionFillOperationMemory;
        mem.linkId = this.linkId;
        mem.pathAStandLocation = this.pathAStandLocation;
        mem.pathBStandLocation = this.pathBStandLocation;
        mem.AWaitLocation = this.AWaitLocation;
        mem.BWaitLocation = this.BWaitLocation;
        mem.lastAssignedWasA = this.lastAssignedWasA;
        return mem;
    }
}

export interface ExtensionFillOperationMemory extends ControllerOperationMemory {
    linkId: string
    pathAStandLocation: { x: number, y: number };
    pathBStandLocation: { x: number, y: number };
    AWaitLocation: { x: number, y: number };
    BWaitLocation: { x: number, y: number };
    lastAssignedWasA: boolean;
}
