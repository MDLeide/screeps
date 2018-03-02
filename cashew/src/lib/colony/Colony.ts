import { Nest } from "./Nest";
import { Population } from "./Population";
import { ResourceManager } from "./ResourceManager";
import { RemoteMiningManager } from "./RemoteMiningManager";
import { ColonyProgress, ColonyProgressRepository } from "./ColonyProgress";
import { OperationPlan, OperationPlanRepository } from "./OperationPlan";
import { Watchtower } from "./Watchtower";
import { TowerController } from "./TowerController";
import { LinkManager } from "./LinkManager";

import { Empire } from "../empire/Empire";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";
import { MapBlock } from "../map/base/MapBlock";

export class Colony  {
    public static fromMemory(memory: ColonyMemory): Colony {
        let colony = new this(
            Nest.fromMemory(memory.nest),
            memory.name,
            ColonyProgressRepository.load(memory.progress)
        );

        colony.remoteMiningManager = RemoteMiningManager.fromMemory(memory.remoteMiningManager, colony);
        colony.watchtower = Watchtower.fromMemory(memory.watchtower);
        colony.resourceManager = ResourceManager.fromMemory(memory.resourceManager, colony);

        for (var i = 0; i < memory.operationPlans.length; i++)
            colony.operationPlans.push(OperationPlanRepository.load(memory.operationPlans[i]));
        
        return colony;
    }

    constructor(nest: Nest, name: string, progress: ColonyProgress) {
        this.nest = nest;
        this.name = name;

        this.progress = progress;
        this.population = new Population(this);            
        this.towerController = new TowerController();
        this.linkManager = new LinkManager();
    }


    public name: string;
    public nest: Nest;
    public population: Population;
    public resourceManager: ResourceManager;
    public progress: ColonyProgress;
    public operationPlans: OperationPlan[] = [];
    public remoteMiningManager: RemoteMiningManager;
    public watchtower: Watchtower;
    public towerController: TowerController;
    public towers: StructureTower[] = [];
    public linkManager: LinkManager;


    /** Should be called once, after initial object contruction. Do not need to call when loading from memory. */
    public initialize(): void {
        this.remoteMiningManager = new RemoteMiningManager(this);
        this.watchtower = new Watchtower();
        this.resourceManager = new ResourceManager(this);
        this.resourceManager.initialize();
    }


    public load(): void {
        this.towers = this.nest.room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (struct) => struct.structureType == STRUCTURE_TOWER });

        this.nest.load();
        this.progress.load();
        this.resourceManager.load();
        this.watchtower.load();        

        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].load();

        this.remoteMiningManager.load();        
    }

    public update(): void {
        this.nest.update();
        this.resourceManager.update();
        this.progress.update(this);
        this.population.update();        
        this.watchtower.update(this);

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.update(this, this.towers[i]);
        
        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].update(this);
    }

    public execute(): void {
        this.nest.execute();
        this.resourceManager.execute();
        this.progress.execute(this);
        this.watchtower.execute(this);

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.execute(this, this.towers[i]);

        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].execute(this);

        this.linkManager.execute(this);
    }

    public cleanup(): void {
        this.nest.cleanup();
        this.resourceManager.cleanup();
        this.progress.cleanup(this);
        this.watchtower.cleanup(this);

        for (var i = 0; i < this.towers.length; i++)
            this.towerController.cleanup(this, this.towers[i]);

        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].cleanup(this);
    }


    public addOperationPlan(operationPlan: OperationPlan): void {
        this.operationPlans.push(operationPlan);
    }

    public removeOperationPlan(operationPlan: OperationPlan): void {
        let index = this.operationPlans.indexOf(operationPlan);
        if (index >= 0)
            this.operationPlans.splice(index, 1);
    }


    public creepBelongsToColony(creep: (Creep | string)): boolean {
        if (creep instanceof Creep)
            return this.creepBelongsToColony(creep.name);

        return this.population.creepFromThisColony(Memory.creeps[creep]);
    }

    public canSpawn(body: Body): boolean {
        return this.nest.canSpawn(body)
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(body: Body): {name: string, spawner: Spawner} | null {
        var result = this.nest.spawnCreep(body);
        if (result)
            global.events.colony.creepSpawning(this.name, result.name, body.type);
        return result;
    }


    public getWithdrawTarget(creep: Creep): WithdrawTarget {
        return this.resourceManager.getWithdrawTarget(creep);
    }

    public getTransferTarget(creep: Creep): TransferTarget {
        return this.resourceManager.getTransferTarget(creep);
    }

    public getSpawnTransferTarget(creep: Creep): (StructureSpawn | StructureExtension) {
        return this.resourceManager.getSpawnExtensionTransferTargets(creep);
    }
    

    protected getOperationPlanMemory(): OperationPlanMemory[] {
        let mem: OperationPlanMemory[] = [];
        for (var i = 0; i < this.operationPlans.length; i++)
            mem.push(this.operationPlans[i].save());
        return mem;
    }

    public save(): ColonyMemory {
        return {
            name: this.name,
            nest: this.nest.save(),
            progress: this.progress.save(),
            resourceManager: this.resourceManager.save(),
            operationPlans: this.getOperationPlanMemory(),
            remoteMiningManager: this.remoteMiningManager.save(),
            watchtower: this.watchtower.save()
        };
    }
}
