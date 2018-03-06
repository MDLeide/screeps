import { Empire } from "../../empire/Empire"
import { ColonyVisual } from "./ColonyVisual";

export class Visuals {
    constructor() {
        if (Memory.visuals.colony)
            this.colonyVisual = ColonyVisual.fromMemory(Memory.visuals.colony);
        else
            this.colonyVisual = new ColonyVisual();
    }

    public help(): string {
        return "general() g() - turns on/off drawing of gneeral info" +
            "energy() e() - turns on/off drawing of colony economic stats" +
            "nestStructs() nst() - turns on/off drawing of structures from the nest plan </br>" +
            "nestSpecials() nsp() - turns on/off drawing of special values from the nest plan </br>";
    }


    public colonyVisual: ColonyVisual;

    public g(): void { this.general(); }
    public general(): void {
        this.colonyVisual.drawGeneralInfo = !this.colonyVisual.drawGeneralInfo;
    }

    public e(): void { this.energy(); }
    public energy(): void {
        this.colonyVisual.drawEnergyStats = !this.colonyVisual.drawEnergyStats;
    }

    public nst(): void { this.nestStructs(); }
    public nestStructs(): void {
        this.colonyVisual.drawStructures = !this.colonyVisual.drawStructures;
    }

    public nsp(): void { this.nestSpecials(); }
    public nestSpecials(): void {
        this.colonyVisual.drawSpecialTokens = !this.colonyVisual.drawSpecialTokens;
    }

    
    public update(empire: Empire): void {
        for (var i = 0; i < empire.colonies.length; i++) {
            this.colonyVisual.draw(empire.colonies[i]);
        }
        Memory.visuals.colony = this.colonyVisual.save();
    }

}
