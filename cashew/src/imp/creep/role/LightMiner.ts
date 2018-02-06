import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { TransporterState } from "./state/TransporterState";
import { ITransporterState } from "./state/ITransporterState";
import { SupplyingSpawn } from "../activity/SupplyingSpawn";
import { MiningEnergy } from "../activity/MiningEnergy";
import { BuildingStructure } from "../activity/BuildingStructure";
import { UpgradingController } from "../activity/UpgradingController";

export class LightMiner extends Role {
    public static readonly id: string = "lightMiner";

    constructor(creep: Creep) {        
        super(creep, LightMiner.id, new TransporterState());        
    }

    public static readonly PHASE_DELIVER: number = 0;
    public static readonly PHASE_PICKUP: number = 1;


    public state: ITransporterState;


    public get phase(): number {
        return this.state.phase;
    }

    public set phase(val: number) {
        this.state.phase = val;
    }


    public onDeath(): void {
    }

    protected preIdleCheck(): void {
        if (this.phase == LightMiner.PHASE_DELIVER && this.creep.nut.carryTotal == 0) {            
            this.phase = LightMiner.PHASE_PICKUP;
        } else if (this.phase == LightMiner.PHASE_PICKUP && this.creep.nut.carryTotal > 0) {            
            this.phase = LightMiner.PHASE_DELIVER;
        }
    }

    protected preActivityValidation(): void {        
    }

    protected preActivityExecution(activity: Activity): void {
        if (activity) {
        }
    }

    protected getNextActivity(): Activity {
        if (this.phase == LightMiner.PHASE_DELIVER) {            

            var spawnTargets = this.creep.nut.home.nut.getEnergyTargets();
            if (spawnTargets && spawnTargets.length > 0) {
                return new SupplyingSpawn(this.creep, this.creep.nut.home);
            }            

            var sites = this.creep.room.nut.seed.findConstructionSites();
            if (sites.length) {
                return new BuildingStructure(this.creep);
            }

            return new UpgradingController(this.creep);
            
        } else {
            return new MiningEnergy(this.creep);
        }        
    }
        
    protected postActivityExecution(executionResponse: ActivityResponse): boolean {
        if (executionResponse) {
            //todo: suppress
        }        
        return false;
    }    
}
