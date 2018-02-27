import { Nest } from "./Nest";
import { Population } from "./Population";
import { ResourceManager } from "./ResourceManager";

import { Empire } from "../empire/Empire";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";
import { ColonyProgress, ColonyProgressRepository } from "./ColonyProgress";
import { OperationPlan, OperationPlanRepository } from "./OperationPlan";
import { MapBlock } from "../map/base/MapBlock";

export class Colony  {
    public static fromMemory(memory: ColonyMemory): Colony {
        let colony = new this(
            Nest.fromMemory(memory.nest),
            memory.name,
            ColonyProgressRepository.load(memory.progress)
        );
        colony.resourceManager = ResourceManager.fromMemory(memory.resourceManager, colony);

        for (var i = 0; i < memory.operationPlans.length; i++)
            colony.operationPlans.push(OperationPlanRepository.load(memory.operationPlans[i]));
        
        return colony;
    }

    constructor(nest: Nest, name: string, progress: ColonyProgress) {
        this.nest = nest;
        this.name = name;

        this.population = new Population(this);
        this.resourceManager = new ResourceManager(this);
    }


    public name: string;
    public nest: Nest;
    public population: Population;
    public resourceManager: ResourceManager;
    public progress: ColonyProgress;
    public operationPlans: OperationPlan[] = [];
    

    public load(): void {
        this.nest.load();
        this.progress.load();
        this.resourceManager.load();
        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].load();        
    }

    public update(): void {
        this.nest.update();
        this.resourceManager.update();
        this.population.update();
        this.progress.update(this);
        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].update(this);
    }

    public execute(): void {
        this.nest.execute();
        this.resourceManager.execute();
        this.progress.execute(this);
        for (var i = 0; i < this.operationPlans.length; i++)
            this.operationPlans[i].execute(this);
    }

    public cleanup(): void {
        this.nest.cleanup();
        this.resourceManager.cleanup();
        this.progress.cleanup(this);
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

    public getControllerEnergySource(): (StructureContainer | StructureLink) {
        let loc = this.nest.nestMap.controllerBlock.getContainerLocation();
        let source = this.nest.room.lookForAt(LOOK_STRUCTURES, loc.x, loc.y);
        if (source.length) {
            if (source[0].structureType == STRUCTURE_CONTAINER)
                return source[0] as StructureContainer;
            else if (source[0].structureType == STRUCTURE_LINK)
                return source[0] as StructureLink;
        }
            
        return null;
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
            operationPlans: this.getOperationPlanMemory()
        };
    }
}
