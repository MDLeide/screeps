import { Assignment } from "lib/operation/Assignment";
import { Job } from "lib/creep/Job";
import { Colony } from "lib/colony/Colony";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { ControllerOperation } from "lib/operation/ControllerOperation";
import { CreepController } from "lib/creep/CreepController";
import { JobOperation } from "lib/operation/JobOperation";
import { MilitaryCalculator, ThreatProfile } from "lib/util/MilitaryCalculator";
import { RoomHelper } from "lib/util/RoomHelper";
import { BodyRepository } from "../../creep/BodyRepository";
import { ScoutJob } from "../../creep/ScoutJob";
import { WarriorAttackTargetJob } from "imp/creep/military/WarriorAttackTargetJob";
import { HealTargetJob } from "imp/creep/military/HealTargetJob";

export class RemoteDefenseOperation extends JobOperation {
    public roomName: string;
    public room: Room;
    public threat: ThreatProfile;
    public scouting: boolean;

    protected getJob(assignment: Assignment): Job {
        if (this.scouting) {
            return new ScoutJob(this.roomName);
        } else {
            let creep = Game.creeps[assignment.creepName];
            if (!creep || creep.room.name != this.roomName)
                return new ScoutJob(this.roomName);

            let target: Creep;
            switch (assignment.body.type) {
                case BODY_HEALER:
                    target = this.getHealTarget(creep);
                    if (target)
                        return new HealTargetJob(target);
                    return null;
                case BODY_WARRIOR:
                    target = this.getAttackTarget(creep);
                    if (target)
                        return new WarriorAttackTargetJob(target);
                    return null;
            }

            return null;
        }
    }

    private getHealTarget(creep: Creep): Creep {
        return MilitaryCalculator.getNearestDamagedFriendly(creep);
    }

    private getAttackTarget(creep: Creep): Creep {
        return MilitaryCalculator.getNearestHostile(creep);
    }

    public isFinished(colony: Colony): boolean {
        throw new Error("Method not implemented.");
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        if (this.scouting) {
            if (this.room) {
                this.threat = MilitaryCalculator.Room.getThreatProfile(this.room);        
                this.scouting = false;
                this.addAssignments();
            }
        } else {
            if (!this.room) {
                this.scouting = true;
                this.clearAssignments();
                this.assignments.push(new Assignment(undefined, BodyRepository.scout()));
            }
        }
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    protected onInit(colony: Colony): InitStatus {
        if (this.room)
            this.threat = MilitaryCalculator.Room.getThreatProfile(this.room);        

        if (this.threat) {
            this.addAssignments();
        } else {
            this.scouting = true;
            this.assignments.push(new Assignment(undefined, BodyRepository.scout()));
        }

        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() >= 1)
            return StartStatus.Started;
        return StartStatus.TryAgain;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(colony: Colony): void {
    }

    private addAssignments(): void {
        this.clearAssignments();

        let score = this.threat.attack + this.threat.rangedDamage;
        let healerBody = BodyRepository.healer();
        let attackBody = BodyRepository.warrior();
        if (score < 500) {
            healerBody.maxCompleteScalingSections = 8;
            attackBody.maxCompleteScalingSections = 8;
        } else if (score < 1500) {
            healerBody.maxCompleteScalingSections = 15;
            attackBody.maxCompleteScalingSections = 15;
        } else {
            healerBody.maxCompleteScalingSections = 0;
            attackBody.maxCompleteScalingSections = 0;
            this.assignments.push(new Assignment(undefined, healerBody));
            this.assignments.push(new Assignment(undefined, attackBody));
        }
        this.assignments.push(new Assignment(undefined, healerBody));
        this.assignments.push(new Assignment(undefined, attackBody));
    }
}
