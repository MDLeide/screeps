import { OperationPlan } from "../../lib/colony/OperationPlan";
import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";
import { RemoteHarvestScoutOperation } from "../operation/economic/RemoteHarvestScoutOperation";
import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";

export class RemoteMiningPlan extends OperationPlan {
    public static fromMemory(memory: OperationPlanMemory): RemoteMiningPlan {
        let plan = new this();
        return OperationPlan.fromMemory(memory, plan) as RemoteMiningPlan;
    }

    constructor() {
        super(PLAN_REMOTE_MINING);
    }

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        if (colony.progress.newMilestoneThisTick && colony.progress.mostRecentMilestone.id == "rcl2") {
            for (var i = 0; i < 3; i++) {
                this.addOperation(new RemoteHarvestScoutOperation());
            }            
        }

        for (var i = 0; i < colony.remoteMiningManager.rooms.length; i++) {
            let room = colony.remoteMiningManager.rooms[i];
            if (!room.scouted)
                continue;

            for (var j = 0; j < room.remoteSources.length; j++) {
                if (!room.remoteSources[j].beingMined) {
                    this.addOperation(new RemoteHarvestOperation(room.remoteSources[j].sourceId, room.name));
                    room.remoteSources[j].beingMined = true;
                }
            }
        }
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }
}
