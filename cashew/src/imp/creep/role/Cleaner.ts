import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { TransporterState } from "./state/TransporterState";
import { ITransporterState } from "./state/ITransporterState";
import { WithdrawingEnergy } from "../activity/WithdrawingEnergy";
import { SupplyingSpawn } from "../activity/SupplyingSpawn";
import { SupplyingController } from "../activity/SupplyingController";
import { ChargingTower } from "../activity/ChargingTower";
import { PickingEnergy } from "../activity/PickingEnergy";

export class Cleaner extends Role {
    public static readonly id: string = "cleaner";
    
    constructor(creep: Creep) {
        super(creep, Cleaner.id, new TransporterState());
    }

    public state: ITransporterState;
    
    public get phase(): number {
        return this.state.phase;
    }

    public set phase(val: number) {
        this.state.phase = val;
    }

    public onDeath(): void {
    }

    //todo: improve the creeps awareness of its surroundings
    //for example, if a creep is withdrawing energy, it might get two targets
    // on its way from the first to the second, it is carrying energy
    // it may pass by eligible energy targets on its way to pickup from the second target
    protected preIdleCheck(): void {
        if (this.phase == 0 && this.creep.nut.carryTotal > 0) {
            this.phase = 1;
            this.setActivity(this.getNextActivity());
        } else if (this.phase == 1 && this.creep.nut.carryTotal == 0) {
            this.phase = 0;
            this.setActivity(this.getNextActivity());
        }
    }

    protected preActivityValidation(): void {
    }

    protected getNextActivity(): Activity {
        if (this.phase == 1) {
            //tood: fiddle with some thresholds and priorities here

            var spawnTargets = this.creep.nut.home.nut.getEnergyTargets();
            if (spawnTargets && spawnTargets.length > 0) {
                return new SupplyingSpawn(this.creep, this.creep.nut.home);
            }

            var tower = this.creep.room.find<StructureTower>(FIND_MY_STRUCTURES,
                { filter: (struct: Structure) => { return struct.structureType == STRUCTURE_TOWER; } });
            if (tower && tower.length > 0) {
                for (var i = 0; i < tower.length; i++) {
                    var t = tower[i];
                    if (t.energy / t.energyCapacity <= .8) // todo: move the value to a settings file
                        return new ChargingTower(this.creep);
                }
            }

            return new SupplyingController(this.creep);
        } else {
            var dropped = this.creep.room.find(FIND_DROPPED_RESOURCES);
            if (dropped.length) {
                return new PickingEnergy(this.creep);
            }

            return new WithdrawingEnergy(this.creep);
        }
    }

    protected preActivityExecution(activity: Activity): void {
        //todo:supressing error - should be stripped out
        //todo: there is supposed to be logic here regarding the creeps carry capacity and the current phase - it seems to have disappeared. needs to be replaced.
        if (activity) {

        } else {
                
        }
    }

    protected postActivityExecution(response: ActivityResponse) : boolean {
        return false;
    }
}
