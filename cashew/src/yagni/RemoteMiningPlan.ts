//import { OperationPlan } from "../../lib/colony/OperationPlan";
//import { Colony } from "../../lib/colony/Colony";
//import { Operation } from "../../lib/operation/Operation";
//import { RemoteHarvestScoutOperation } from "../operation/economic/RemoteHarvestScoutOperation";
//import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";
//import { ReservationOperation } from "../operation/military/ReservationOperation";

//export class RemoteMiningPlan extends OperationPlan {
//    public static fromMemory(memory: OperationPlanMemory): RemoteMiningPlan {
//        let plan = new this();
//        return OperationPlan.fromMemory(memory, plan) as RemoteMiningPlan;
//    }

//    constructor() {
//        super(PLAN_REMOTE_MINING);
//    }

//    protected onLoad(): void {
//    }

//    protected onUpdate(colony: Colony): void {
//        if (colony.progress.newMilestoneThisTick && colony.progress.mostRecentMilestone.id == "rcl2") {
//            for (var i = 0; i < 2; i++) {
//                this.addOperation(new RemoteHarvestScoutOperation());
//            }
//        }

//        colony.remoteMiningManager.maxActiveRooms = 2; // test value

//        if (colony.nest.room.controller.level >= 3) {
//            for (var i = 0; i < colony.remoteMiningManager.rooms.length; i++) {
//                let room = colony.remoteMiningManager.rooms[i];
//                if (room.active && !room.beingReserved) {
//                    this.addOperation(new ReservationOperation(room.name));
//                    room.beingReserved = true;
//                }
//            }
//        }    

//        let remoteSource = colony.remoteMiningManager.getNextMiningAssignment();
//        if (remoteSource) {
//            this.addOperation(new RemoteHarvestOperation(remoteSource.source.sourceId, remoteSource.room.name));            
//            remoteSource.source.beingMined = true;
//        }
//    }

//    protected onExecute(colony: Colony): void {
//    }

//    protected onCleanup(colony: Colony): void {
//    }
//}
