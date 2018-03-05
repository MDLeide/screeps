import { CreepController } from "../../lib/creep/CreepController";

export class RemoteHarvesterController extends CreepController {
    public static fromMemory(memory: RemoteHarvesterControllerMemory): CreepController {
        var controller = new this(memory.sourceId, memory.roomName, memory.containerId);

        controller.siteId = memory.siteId;

        controller.repaired = memory.repaired;
        controller.created = memory.created;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(sourceId: string, roomName: string, containerId?: string) {
        super(CREEP_CONTROLLER_REMOTE_HARVESTER);
        this.sourceId = sourceId;
        this.roomName = roomName;
        this.containerId = containerId;
    }


    public site: ConstructionSite;
    public container: StructureContainer;
    public source: Source;

    public roomName: string;

    public sourceId: string;
    public siteId: string;
    public containerId: string;

    public created: boolean;    
    public repaired: boolean;


    protected onLoad(): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);

        if (this.siteId)
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);

        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.created && !this.siteId && creep.room.name == this.roomName) {
            let sites = this.source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (sites.length) {
                this.siteId = sites[0].id;
                this.site = sites[0];
            }        
        }

        if (this.created && this.siteId && !this.container) {
            let containers = this.source.pos.findInRange(FIND_STRUCTURES, 2);
            
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].structureType == STRUCTURE_CONTAINER) {
                    this.containerId = containers[i].id;
                    this.container = containers[i] as StructureContainer;

                    let colony = global.empire.getColonyByCreep(creep);
                    let remoteSource = colony.remoteMiningManager.getRemoteSourceById(this.sourceId);
                    if (remoteSource)
                        remoteSource.containerId = this.containerId;
                }                    
            }            
        }

        if (this.container) {
            if (this.container.hits >= this.container.hitsMax - 10)
                this.repaired = true;
        }
    }

    protected onExecute(creep: Creep): void {
        if (this.roomName == creep.room.name) {
            if (this.repaired) {
                this.harvest(creep);
            } else if (this.container) {
                this.repair(creep);
            } else if (this.site) {
                this.build(creep);
            } else {
                let path = PathFinder.search(creep.pos, { pos: this.source.pos, range: 1 });
                creep.room.createConstructionSite(path.path[path.path.length - 2], STRUCTURE_CONTAINER);
                this.created = true;
                creep.moveTo(this.source);
            }
        } else {
            let target = new RoomPosition(25, 25, this.roomName);
            creep.moveTo(target);
        }
        
    }

    protected onCleanup(creep: Creep): void { }

    private build(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy >= 25) {
            let response = creep.build(this.site);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(this.site);
            else if (response == OK)
                colony.resourceManager.ledger.registerBuild(creep);
        } else {
            let response = creep.harvest(this.source);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(this.source);
            else if (response == OK)
                colony.resourceManager.ledger.registerRemoteHarvest(creep);     
        }
    }

    private repair(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy >= 25) {
            let response = creep.repair(this.container);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(this.container);
            else if (response == OK)
                colony.resourceManager.ledger.registerRepair(
                    Math.min(creep.carry.energy, creep.getActiveBodyparts(WORK)));
        } else {
            let response = creep.harvest(this.source);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(this.source);
            else if (response == OK)
                colony.resourceManager.ledger.registerRemoteHarvest(creep);
        }
    }

    private moving(creep: Creep): void {        
        creep.moveTo(this.source);
    }

    private harvest(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);
        let harvestResponse = creep.harvest(this.source);

        if (harvestResponse == ERR_NOT_IN_RANGE) {
            creep.moveTo(this.source);
            return;
        } else if (harvestResponse == OK) {
            colony.resourceManager.ledger.registerRemoteHarvest(creep);
        }

        let transferResponse = creep.transfer(this.container, RESOURCE_ENERGY);
        if (transferResponse == ERR_NOT_IN_RANGE) {
            creep.moveTo(this.container);
        }
    }

    protected onSave(): RemoteHarvesterControllerMemory {
        return {
            type: this.type,            
            containerId: this.containerId,
            sourceId: this.sourceId,
            siteId: this.siteId,
            roomName: this.roomName,
            created: this.created,
            repaired: this.repaired
        };
    }

}

export interface RemoteHarvesterControllerMemory extends CreepControllerMemory {    
    containerId: string;
    sourceId: string;
    siteId: string;

    roomName: string;
    created: boolean;
    repaired: boolean;
}
