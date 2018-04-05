import { Nest } from "./Nest";
import { Population } from "./Population";
import { Spawner } from "./Spawner";
import { ResourceManager } from "./ResourceManager";
import { RemoteMiningManager } from "./RemoteMiningManager";
import { Watchtower } from "./Watchtower";
import { TowerController } from "./TowerController";
import { LinkManager } from "./LinkManager";
import { ColonyMonitor } from "./ColonyMonitor";

import { Empire } from "../empire/Empire";
import { Body } from "../creep/Body";
import { MapBlock } from "../map/base/MapBlock";
import { TypedMonitorManager } from "../monitor/MonitorManager";
import { OperationGroup } from "../operation/OperationGroup";
import { Campaign, CampaignRepository } from "../operation/Campaign";
import { EffectiveRcl, EffectiveRclCaclulator } from "./EffectiveRcl";

export class Colony  {
    public static fromMemory(memory: ColonyMemory): Colony {
        let colony = new this(
            Nest.fromMemory(memory.nest),
            memory.name,            
            TypedMonitorManager.fromMemory(memory.monitorManager)
        );

        colony.remoteMiningManager = RemoteMiningManager.fromMemory(memory.remoteMiningManager, colony);
        colony.watchtower = Watchtower.fromMemory(memory.watchtower);
        colony.resourceManager = ResourceManager.fromMemory(memory.resourceManager, colony);
        colony.operations = OperationGroup.fromMemory(memory.operations);
        for (var i = 0; i < memory.campaigns.length; i++)
            colony.campaigns.push(CampaignRepository.load(memory.campaigns[i]));
        
        return colony;
    }

    private effectiveRcl: EffectiveRcl;

    constructor(nest: Nest, name: string, monitorManager: TypedMonitorManager<Colony>) {
        this.nest = nest;
        this.name = name;

        this.population = new Population(this);            
        this.towerController = new TowerController();
        this.linkManager = new LinkManager();
        this.monitorManager = monitorManager;
    }
    
    public name: string;
    public nest: Nest;
    public population: Population;
    public resourceManager: ResourceManager;    
    public remoteMiningManager: RemoteMiningManager;
    public watchtower: Watchtower;

    public monitorManager: TypedMonitorManager<Colony>;
    public operations: OperationGroup;
    public campaigns: Campaign[] = [];

    public towerController: TowerController;
    public towers: StructureTower[] = [];
    public linkManager: LinkManager;
    
    /** Should be called once, after initial object contruction. Do not need to call when loading from memory. */
    public initialize(): void {
        this.remoteMiningManager = new RemoteMiningManager(this);
        this.remoteMiningManager.initialize();
        this.watchtower = new Watchtower();
        this.resourceManager = new ResourceManager(this);
        this.resourceManager.initialize();
        this.nest.checkEnergyStructureOrder();
        this.operations = new OperationGroup([]);
    }
    
    public load(): void {
        this.towers = this.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_TOWER });

        this.nest.load();
        this.resourceManager.load();
        this.watchtower.load();        
        
        this.monitorManager.load();
        this.operations.load();
        for (var i = 0; i < this.campaigns.length; i++)
            this.campaigns[i].load();

        this.remoteMiningManager.load();        
    }

    public update(): void {
        this.nest.update(this);
        this.resourceManager.update();
        this.population.update();        
        this.watchtower.update(this);

        this.monitorManager.update(this);
        this.operations.update(this);
        for (var i = 0; i < this.campaigns.length; i++)
            this.campaigns[i].update(this);        

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.update(this, this.towers[i]);
    }

    public execute(): void {
        this.nest.execute(this);
        this.resourceManager.execute();
        this.watchtower.execute(this);
        this.monitorManager.execute(this);
        this.operations.execute(this);
        for (var i = 0; i < this.campaigns.length; i++)
            this.campaigns[i].execute(this);

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.execute(this, this.towers[i]);
        
        this.linkManager.execute(this);
    }

    public cleanup(): void {
        this.nest.cleanup(this);
        this.resourceManager.cleanup();
        this.watchtower.cleanup(this);

        this.monitorManager.cleanup(this);
        this.operations.cleanup(this);
        for (var i = 0; i < this.campaigns.length; i++) {
            this.campaigns[i].cleanup(this);
            if (this.campaigns[i].finished)
                this.campaigns.splice(i--, 1);
        }

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.cleanup(this, this.towers[i]);
    }

    public registerDropOff(demandOrderId: string, supplyOrderId: string, quantity: number): void {
        let order = global.empire.exchange.demandOrders[demandOrderId];
        if (!order) return;
        if (order.resource == RESOURCE_ENERGY)
            this.resourceManager.ledger.registerEmpireIncoming(quantity);
        global.empire.exchange.fillOrder(demandOrderId, supplyOrderId, quantity);
    }

    public registerPickUp(supplyOrderId: string, demandOrderId: string, quantity: number): void {
        let order = global.empire.exchange.supplyOrders[supplyOrderId];
        if (!order) return;
        if (order.resource == RESOURCE_ENERGY)
            this.resourceManager.ledger.registerEmpireOutgoing(quantity);
        global.empire.exchange.fillOrder(supplyOrderId, demandOrderId, quantity);
    }

    public getEffectiveRcl(forceRecalculation: boolean = false): EffectiveRcl {
        if (forceRecalculation || !this.effectiveRcl)
            this.effectiveRcl = EffectiveRclCaclulator.evaluate(this);
        return this.effectiveRcl;
    }

    public creepBelongsToColony(creep: (Creep | string)): boolean {
        if (creep instanceof Creep)
            return this.creepBelongsToColony(creep.name);

        return this.population.creepFromThisColony(Memory.creeps[creep]);
    }

    public canSpawn(body: Body): boolean {
        return this.nest.canSpawn(body)
    }
    
    /** Returns true if the Colony can support the spawn request from another Colony. */
    public canSpawnSupport(body: Body): boolean {
        if (this.getEffectiveRcl().isLessThan(5, 0))
            return false;
        return this.nest.canSpawnSupport(body);
    }
    
    /** Returns the Spawner used if successful, otherwise null
     * @param body Body to use for spawning.
     * @param priority An optional number indicating the priority of the spawn. Higher numbers are spawned first.
     * @param transfer An optional Colony that the creep will be assigned to. If omited it will be assigned to this Colony.
     */
    public spawnCreep(body: Body, priority?: number, transfer?: Colony): string | null {
        var result = this.nest.spawnCreep(
            body,
            transfer ? transfer.name : this.name,
            this.name,
            priority);
        return result;
    }

    /** Returns true if there is a creep with the provided name spawning or scheduled to spawn. */
    public creepIsScheduled(creep: Creep | string): boolean {
        return this.nest.creepIsScheduled(creep);
    }

    public save(): ColonyMemory {
        return {
            name: this.name,
            nest: this.nest.save(),
            resourceManager: this.resourceManager.save(),
            remoteMiningManager: this.remoteMiningManager.save(),
            watchtower: this.watchtower.save(),
            monitorManager: this.monitorManager.save(),
            operations: this.operations.save(),
            campaigns: this.campaigns.map(p => p.save())
        };
    }
}
