import { ColonyInfoVisual } from "./ColonyInfoVisual";
import { EnergyVisual } from "./EnergyVisual";
import { NestSpecialVisual } from "./NestSpecialVisual";
import { NestStructureVisual } from "./NestStructureVisual";
import { OperationsVisual } from "./OperationsVisual";
import { CpuVisual } from "./CpuVisual";
import { CreepOperationVisual } from "./CreepVisuals";
import { SpawnQueueVisual } from "./SpawnQueueVisual";


export class VisualBuilder {
    public static build(): void {
        let col = new ColonyInfoVisual();
        col.x = 25;
        col.y = 1;
        col.on();
        global.visuals.addComponent(col);

        let energy = new EnergyVisual();
        energy.x = 5;
        energy.y = 2;
        energy.on();
        global.visuals.addComponent(energy);

        let spawnQueue = new SpawnQueueVisual();
        spawnQueue.x = .5;
        spawnQueue.y = 17;
        global.visuals.addComponent(spawnQueue);

        let nestSpecial = new NestSpecialVisual();
        global.visuals.addComponent(nestSpecial);

        let nestStructure = new NestStructureVisual();
        global.visuals.addComponent(nestStructure);

        let ops = new OperationsVisual();
        ops.x = 0;
        ops.y = 18;
        global.visuals.addComponent(ops);
        
        let cpu = new CpuVisual();
        cpu.x = 45;
        cpu.y = 2;
        cpu.on();
        global.visuals.addComponent(cpu);

        let creepOps = new CreepOperationVisual();
        global.visuals.addComponent(creepOps);
    }
}
