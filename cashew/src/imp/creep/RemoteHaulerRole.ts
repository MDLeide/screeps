import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

export class RemoteHaulerRole extends Role {
    public static fromMemory(memory: RemoteHaulerRoleMemory): RemoteHaulerRole {
        let hauler = new this(memory.withdrawTargetId, memory.roomName);
        return Role.fromMemory(memory, hauler) as RemoteHaulerRole;
    }

    constructor(withdrawTargetId: string, roomName: string) {
        super(CREEP_CONTROLLER_REMOTE_HAULER);
        this.withdrawTargetId = withdrawTargetId;
        this.roomName = roomName;
    }


    public withdrawTarget: WithdrawTarget;
    public withdrawTargetId: string;
    public roomName: string;    


    protected onLoad(): void {
        if (this.withdrawTargetId)
            this.withdrawTarget = Game.getObjectById<WithdrawTarget>(this.withdrawTargetId);
    }

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getCreepsColony(creep);
        
        if (creep.carry.energy > 0) {
            let transferTarget = colony.resourceManager.getTransferTarget(creep);
            if (transferTarget)
                return Task.Transfer(transferTarget);
        } else {
            if (creep.room.name != this.roomName) {
                let target = new RoomPosition(25, 25, this.roomName);
                return Task.MoveTo(target, 24);
            }

            if (this.withdrawTarget)
                return Task.Withdraw(this.withdrawTarget);
        }
        return null;
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onSave(): RemoteHaulerRoleMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            withdrawTargetId: this.withdrawTargetId,
            roomName: this.roomName
        };
    }
}


export interface RemoteHaulerRoleMemory extends RoleMemory {
    withdrawTargetId: string;
    roomName: string;
}
