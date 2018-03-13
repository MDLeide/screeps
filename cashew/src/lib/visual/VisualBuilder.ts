import { ColonyInfoVisual } from "./ColonyInfoVisual";
import { EnergyVisual } from "./EnergyVisual";
import { NestSpecialVisual } from "./NestSpecialVisual";
import { NestStructureVisual } from "./NestStructureVisual";
import { OperationsVisual } from "./OperationsVisual";
import { CpuVisual } from "./CpuVisual";


export class VisualBuilder {
    public static build(): void {
        let empire = global.empire;
        for (var i = 0; i < empire.colonies.length; i++) {
            let colony = empire.colonies[i];

            let col = new ColonyInfoVisual(colony);            
            col.x = 25;
            col.y = 1;
            col.on();
            global.visuals.addComponent(col);

            let energy = new EnergyVisual(colony);
            energy.x = 5;
            energy.y = 2;
            energy.on();
            global.visuals.addComponent(energy);

            let nestSpecial = new NestSpecialVisual(colony.nest.roomName, colony.nest.nestMap);
            global.visuals.addComponent(nestSpecial);

            let nestStructure = new NestStructureVisual(colony.nest.roomName, colony.nest.nestMap);
            global.visuals.addComponent(nestStructure);

            let ops = new OperationsVisual(colony);
            ops.x = 0;
            ops.y = 18;
            global.visuals.addComponent(ops);

            let cpu = new CpuVisual();
            cpu.x = 45;
            cpu.y = 2;
            cpu.on();
            global.visuals.addComponent(cpu);
        }
    }
}
