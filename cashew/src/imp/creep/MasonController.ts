import { CreepController } from "../../lib/creep/CreepController";
import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";

export class MasonController extends CreepController {
    public static fromMemory(memory: MasonControllerMemory): MasonController {
        let controller = new this();
        controller.siteId = memory.siteId;
        controller.targetId = memory.targetId;
        controller.pickupId = memory.pickupId;
        return CreepController.fromMemory(memory, controller) as MasonController;
    }


    constructor() {
        super(CREEP_CONTROLLER_MASON);
    }


    public siteId: string;
    public targetId: string;
    public pickupId: string;
    public site: ConstructionSite;
    public target: (StructureWall | StructureRampart);
    public pickup: WithdrawTarget;


    protected onLoad(): void {
        if (this.siteId)
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);
        if (this.targetId)
            this.target = Game.getObjectById<(StructureWall | StructureRampart)>(this.targetId);
        if (this.pickupId)
            this.pickup = Game.getObjectById<WithdrawTarget>(this.pickupId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.siteId && !this.site)
            this.siteId = undefined;
        if (this.targetId && !this.target)
            this.targetId = undefined;
        if (creep.carry.energy == 0) { // force new target acquisition
            this.targetId = undefined;
            this.target = null;
            return;
        }

        if (!this.site && !this.target) {
            let rampart = creep.pos.findClosestByRange<StructureRampart>(
                FIND_STRUCTURES,
                { filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 10000 });
            if (rampart) {
                this.target = rampart;
                this.targetId = rampart.id;
                return;
            }

            let site = creep.pos.findClosestByRange(
                FIND_MY_CONSTRUCTION_SITES,
                {
                    filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
                });
            if (site) {
                this.site = site;
                this.siteId = this.site.id;
                this.target = null;
                this.targetId = undefined;
                return;
            }

            let walls = creep.room.find<(StructureWall | StructureRampart)>(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
            });
            let min = 300000000;
            for (var i = 0; i < walls.length; i++) {
                if (walls[i].hits < min) {
                    this.targetId = walls[i].id;
                    this.target = walls[i];
                    min = walls[i].hits;
                }
            }
        }
    }

    protected onExecute(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy > 0) {
            if (this.site) {
                let buildResponse = creep.build(this.site);;
                if (buildResponse == ERR_NOT_IN_RANGE)
                    creep.moveTo(this.site);
                else if (buildResponse == OK)
                    colony.resourceManager.ledger.registerBuild(creep);
            } else if (this.target) {
                let repairResponse = creep.repair(this.target);
                if (repairResponse == ERR_NOT_IN_RANGE)
                    creep.moveTo(this.target);
                else if (repairResponse == OK)
                    colony.resourceManager.ledger.registerRepair(creep);
            }
        } else {
            if (!this.pickup) {
                let colony = global.empire.getColonyByCreep(creep);
                this.pickup = colony.resourceManager.getWithdrawTarget(creep);
                if (this.pickup)
                    this.pickupId = this.pickup.id;
            }

            if (this.pickup) {
                let withdrawResponse = creep.withdraw(this.pickup, RESOURCE_ENERGY);
                if (withdrawResponse == ERR_NOT_IN_RANGE) {
                    creep.moveTo(this.pickup);
                } else if (withdrawResponse == OK) {
                    this.pickup = undefined;
                    this.pickupId = undefined;
                }
            }
        }
    }

    protected onCleanup(creep: Creep): void {
    }


    protected onSave(): MasonControllerMemory {
        return {
            type: this.type,
            siteId: this.siteId,
            targetId: this.targetId,
            pickupId: this.pickupId
        };
    }
}

export interface MasonControllerMemory extends CreepControllerMemory {
    siteId: string;
    targetId: string;
    pickupId: string;
}
