//import { Colony } from "../../../lib/colony/Colony";
//import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
//import { Assignment } from "../../../lib/operation/Assignment";
//import { BodyRepository } from "../../creep/BodyRepository";

//export class RemoteHarvestScoutOperation extends Operation {
//    public static fromMemory(memory: RemoteHarvestScoutOperationMemory): Operation {
//        var op = new this();
//        op.targetRoom = memory.targetRoom;
//        return Operation.fromMemory(memory, op);
//    }


//    constructor() {
//        super(OPERATION_REMOTE_HARVEST_SCOUT, RemoteHarvestScoutOperation.getAssignments());        
//    }


//    public targetRoom: string;


//    private static getAssignments(): Assignment[] {
//        return [
//            new Assignment("", BodyRepository.scout())
//        ];
//    }


//    public isFinished(colony: Colony): boolean {
//        return !this.targetRoom && !colony.remoteMiningManager.getClosestUnscoutedRoom(colony.nest.roomName);
//    }

    
//    protected onInit(colony: Colony): InitStatus {
//        return InitStatus.Initialized;
//    }

//    protected onStart(colony: Colony): StartStatus {
//        if (this.getFilledAssignmentCount() < 1)
//            return StartStatus.TryAgain;
//        return StartStatus.Started;
//    }

//    protected onFinish(colony: Colony): boolean {
//        return true;
//    }

//    protected onCancel() {
//    }


//    protected onLoad(): void {
//    }

//    protected onUpdate(colony: Colony): void {
//    }

//    protected onExecute(colony: Colony): void {
//        if (!this.assignments[0].creepName)
//            return;
//        let creep = Game.creeps[this.assignments[0].creepName];
//        if (!creep)
//            return;

//        if (!this.targetRoom)
//            this.getNextTarget(colony, creep);        

//        if (this.targetRoom && creep.room.name == this.targetRoom) {
//            colony.remoteMiningManager.scoutRoom(this.targetRoom);
//            this.getNextTarget(colony, creep);
//        }

//        if (this.targetRoom) {
//            let pos = new RoomPosition(25, 25, this.targetRoom);
//            creep.moveTo(pos);
//        }        
//    }

//    protected onCleanup(colony: Colony): void {
//    }


//    private getNextTarget(colony: Colony, creep: Creep): void {        
//        this.targetRoom = colony.remoteMiningManager.getClosestUnscoutedRoom(creep.room.name);        
//        if (this.targetRoom)
//            colony.remoteMiningManager.claimScoutJob(this.targetRoom);
//    }


//    public save(): RemoteHarvestScoutOperationMemory {
//        let mem = super.save() as RemoteHarvestScoutOperationMemory;
//        mem.targetRoom = this.targetRoom;
//        return mem;
//    }
//}

//export interface RemoteHarvestScoutOperationMemory extends OperationMemory {
//    targetRoom: string;
//}
