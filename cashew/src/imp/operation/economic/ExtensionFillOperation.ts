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
    }
    
    public linkId: string
    public pathAStandLocation: { x: number, y: number };
    public pathBStandLocation: { x: number, y: number };
    public AWaitLocation: { x: number, y: number };
    public BWaitLocation: { x: number, y: number };

    public lastAssignedWasA: boolean;
    
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
            }
        }
    }


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
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
        colony.resourceManager.extensionsManagedDirectly = true;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        colony.resourceManager.extensionsManagedDirectly = false;
        return true;
    }

    protected onCancel(): void {
    }


    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): CreepController {
        if (this.lastAssignedWasA) {
            this.lastAssignedWasA = !this.lastAssignedWasA;
            return new FillerController(this.pathBStandLocation, this.BWaitLocation, false, this.linkId);
        } else {
            this.lastAssignedWasA = !this.lastAssignedWasA;
            return new FillerController(this.pathAStandLocation, this.AWaitLocation, true, this.linkId);
        } 
    }


    protected onSave(): ExtensionFillOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            linkId: this.linkId,
            pathAStandLocation: this.pathAStandLocation,
            pathBStandLocation: this.pathBStandLocation,
            lastAssignedWasA: this.lastAssignedWasA,
            AWaitLocation: this.AWaitLocation,
            BWaitLocation: this.BWaitLocation
        };
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
