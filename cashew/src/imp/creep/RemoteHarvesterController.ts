import { CreepController } from "../../lib/creep/CreepController";

export class RemoteHarvesterController extends CreepController {
    public static fromMemory(memory: RemoteHarvesterControllerMemory): CreepController {
        var controller = new this(memory.sourceId, memory.roomName, memory.containerId);

        controller.siteId = memory.siteId;

        controller.repaired = memory.repaired;
        controller.siteCreated = memory.siteCreated;
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
    public room: Room;

    public roomName: string;

    public sourceId: string;
    public siteId: string;
    public containerId: string;

    public siteCreated: boolean;

    public repaired: boolean;

    protected onLoad(): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
        if (!this.container)
            this.containerId = undefined;

        if (this.siteId)
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);

        if (this.roomName)
            this.room = Game.rooms[this.roomName];

        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.container) {
            if (this.repaired)
                return;
            else if (this.container && this.container.hits == this.container.hitsMax)
                this.repaired = true;
            return;
        }

        if (this.room) {
            if (!this.container)
                this.findContainer(creep);
            if (this.container)
                return;

            if (this.siteCreated && !this.siteId) { // site newly created
                this.findSite();
                return;
            }

            this.createSite(creep);
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
                creep.moveTo(this.source);
            }
        } else {
            let target = new RoomPosition(25, 25, this.roomName);
            creep.moveTo(target);
        }        
    }

    protected onCleanup(creep: Creep): void { }


    private build(creep: Creep): void {
        if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length) {
            creep.moveTo(this.site);
            return;
        }

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
                colony.resourceManager.ledger.registerRepair(creep);
        } else {
            let response = creep.harvest(this.source);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(this.source);
            else if (response == OK)
                colony.resourceManager.ledger.registerRemoteHarvest(creep);
        }
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
        if (_.sum(creep.carry) >= creep.carryCapacity - HARVEST_POWER * creep.getActiveBodyparts(WORK)) {
            let transferResponse = creep.transfer(this.container, RESOURCE_ENERGY);
            if (transferResponse == ERR_NOT_IN_RANGE) {
                creep.moveTo(this.container);
            }
        }
    }


    private findContainer(creep: Creep): void {
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

    private findSite(): void {
        let sites = this.source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
        if (sites.length) {
            this.siteId = sites[0].id;
            this.site = sites[0];
        }
    }

    private createSite(creep: Creep): void {
        let path = PathFinder.search(creep.pos, { pos: this.source.pos, range: 1 });
        creep.room.createConstructionSite(path.path[path.path.length - 2], STRUCTURE_CONTAINER);
        this.siteCreated = true;
    }


    protected onSave(): RemoteHarvesterControllerMemory {
        return {
            type: this.type,            
            containerId: this.containerId,
            sourceId: this.sourceId,
            siteId: this.siteId,
            roomName: this.roomName,
            siteCreated: this.siteCreated,
            repaired: this.repaired
        };
    }

}

export interface RemoteHarvesterControllerMemory extends CreepControllerMemory {    
    containerId: string;
    sourceId: string;
    siteId: string;

    roomName: string;
    siteCreated: boolean;
    repaired: boolean;
}
