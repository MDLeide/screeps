import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { HeavyHarvesterState } from "./state/HeavyHarvesterState";
import { IHeavyHarvesterState } from "./state/IHeavyHarvesterState";
import { SilentEmptyActivity } from "../../../lib/creep/activity/SilentEmptyActivity";


// we're doing a lot of things differently here, eschewing the use
// of an activity completely, instead implementing action logic in
// the preIdleCheck methods

export class HeavyHarvester extends Role {
    public static readonly id: string = "heavyHarvester";

    private _source: Source;
    private _site: ConstructionSite;
    private _container: StructureContainer;

    public readonly MAKE_CONSTRUCTION_SITE: number = 0;
    public readonly CONSTRUCTION_SITE_PENDING: number = 1;
    public readonly BUILD_CONTAINER: number = 2;
    public readonly HARVEST_ENERGY: number = 3;


    constructor(creep: Creep) {
        super(creep, HeavyHarvester.id, new HeavyHarvesterState());

        var sources = this.creep.room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
            if (!sources[i].nut.isBeingHarvested) {
                this.state.sourceId = sources[i].id;
                sources[i].nut.isBeingHarvested = true;
                break;
            }
        }
    }


    public state: IHeavyHarvesterState;


    public get site(): ConstructionSite {
        if (!this._site) {
            this._site = Game.getObjectById<ConstructionSite>(this.state.constructionSiteId);
        }
        return this._site;
    }

    public get container(): StructureContainer {
        if (!this._container) {
            this._container = Game.getObjectById<StructureContainer>(this.state.containerId);
        }
        return this._container;
    }

    public get source(): Source {
        if (!this._source) {
            this._source = Game.getObjectById<Source>(this.state.sourceId);
        }
        return this._source;
    }

    public get phase(): number {
        return this.state.phase;
    }

    public set phase(val: number) {
        this.state.phase = val;
    }

    // called one tick prior to death
    public onDeath(): void {
        this.source.nut.isBeingHarvested = false;
    }

    protected preIdleCheck(): void {
        if (this.containerFinished()) {
            this.phase = 3;
        }

        if (this.containerConstructionSiteExists()) {
            this.phase = 2;
        }


        if (this.phase == 0) {            
            this.makeConstructionSite();
            this.phase = 1;
        }

        if (this.phase == 1) {
            if (this.containerConstructionSiteExists()) {
                this.phase = 2;
            }
        }

        if (this.phase == 2) {
            if (this.containerFinished()) {                
                this.phase = 3;               
            } else {
                this.buildContainer();
            }
        }

        if (this.phase == 3) {
            this.harvestEnergy();
        }
    }

    protected preActivityValidation(): void { }

    protected preActivityExecution(activity: Activity): void { }

    protected getNextActivity(): Activity {
        return new SilentEmptyActivity(this.creep); // we're handling this a little differently here
    }
        
    protected postActivityExecution(executionResponse: ActivityResponse): boolean {
      return false;
    }

    private containerFinished(): boolean {

        for (var x = -2; x < 3; x++) {
            for (var y = -2; y < 3; y++) {
                var look = this.source.room.lookAt(x + this.source.pos.x , y + this.source.pos.y);
                for (var i = 0; i < look.length; i++) {
                    if (look[i].type == LOOK_STRUCTURES && look[i].structure && look[i].structure.structureType == STRUCTURE_CONTAINER) {                        
                        this.state.containerId = look[i].structure.id;
                        return true;
                    }
                }
            }
        }
        this.state.containerId = "";
        return false;  
    }

    private containerConstructionSiteExists(): boolean {
        for (var x = -2; x < 3; x++) {
            for (var y = -2; y < 3; y++) {
                var look = this.source.room.lookAt(x + this.source.pos.x , y + this.source.pos.y);
                for (var i = 0; i < look.length; i++) {
                    if (look[i].type == LOOK_CONSTRUCTION_SITES && look[i].constructionSite) {
                        this.state.constructionSiteId = look[i].constructionSite.id;
                        return true;
                    }
                }
            }
        }
        this.state.constructionSiteId = "";
        return false;        
    }

    private makeConstructionSite(): void {
        for (var x = -2; x < 3; x++) {
            for (var y = -2; y < 3; y++) {
                var target = this.source.room.lookAt(this.source.pos.x + x, this.source.pos.y + y);
                for (var i = 0; i < target.length; i++) {
                    if (target[i].terrain == "wall")
                        continue;
                    var result = this.source.room.createConstructionSite(this.source.pos.x + x, this.source.pos.y + y, STRUCTURE_CONTAINER);
                    if (result == 0) {                        
                        return;
                    }
                        
                }
            }
        }
    }

    private buildContainer(): void {
        if (this.creep.nut.energyAvailable >= this.creep.getActiveBodyparts(WORK) * 5) {
            var buildResult = this.creep.build(this.site);
            if (buildResult == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.site);
                return;
            }
        } else {
            var result = this.creep.harvest(this.source);
            if (result == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.source);
                return;
            }
        }
    }

    private harvestEnergy(): void {
        var hResult = this.creep.harvest(this.source);
        if (hResult == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.source);
            return; 
        } else {
            this.creep.transfer(this.container, RESOURCE_ENERGY);
        }
    }    
}
