import { NestMapVisual } from "./NestMapVisual";
import { Empire } from "../../empire/Empire"
import { EnergyStatsVisual } from "./EnergyStatsVisual";

export class Visuals {
    public help(): string {
        return "toggleNestStructures() [nestStructs()] - turns on/off drawing of structures from the nest plan </br>" +
            "toggleNestSpecials() [nestSpecials()] - turns on/off drawing of special values from the nest plan </br>" +
            "toggleColonyEnergyStates() [energy()] - turns on/off drawing of colony economic stats";
    }


    public energy(): void {
        this.toggleColonyEnergyStats();
    }

    public nestStructs(): void {
        this.toggleNestStructures();
    }

    public nestSpecials(): void {
        this.toggleNestSpecials();
    }


    public toggleColonyEnergyStats(): void {
        Memory.visuals.drawColonyEnergyStats = !Memory.visuals.drawColonyEnergyStats;
    }

    public toggleNestStructures(): void {
        Memory.visuals.drawNestMapStructures = !Memory.visuals.drawNestMapStructures;
    }

    public toggleNestSpecials(): void {
        Memory.visuals.drawNestMapSpecials = !Memory.visuals.drawNestMapSpecials;
    }



    public update(empire: Empire): void {
        for (var i = 0; i < empire.colonies.length; i++) {
            var visual = new NestMapVisual(empire.colonies[i].nest.roomName, empire.colonies[i].nest.nestMap);

            if (Memory.visuals.drawNestMapStructures)
                visual.drawStructures();

            if (Memory.visuals.drawNestMapSpecials)
                visual.drawRcl();

            if (Memory.visuals.drawColonyEnergyStats)
                EnergyStatsVisual.draw(empire.colonies[i]);
        }
    }

}
