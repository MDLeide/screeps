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
        return "general() g() - turns on/off drawing of gneeral info </br>" +
            "energy() e() - turns on/off drawing of colony economic stats </br>" +
            "nestStructs() s() - turns on/off drawing of structures from the nest plan </br>" +
            "nestSpecials() p() - turns on/off drawing of special values from the nest plan </br>";
    }


    public colonyVisual: ColonyVisual;

    public g(): void { this.general(); }
    public general(): boolean {
        this.colonyVisual.drawGeneralInfo = !this.colonyVisual.drawGeneralInfo;
        this.save();
        return this.colonyVisual.drawGeneralInfo;
    }

    public e(): void { this.energy(); }
    public energy(): boolean {
        this.colonyVisual.drawEnergyStats = !this.colonyVisual.drawEnergyStats;
        this.save();
        return this.colonyVisual.drawEnergyStats;
    }

    public s(): void { this.nestStructs(); }
    public nestStructs(): boolean {
        this.colonyVisual.drawStructures = !this.colonyVisual.drawStructures;
        this.save();
        return this.colonyVisual.drawStructures;
    }

    public p(): void { this.nestSpecials(); }
    public nestSpecials(): boolean {
        this.colonyVisual.drawSpecialTokens = !this.colonyVisual.drawSpecialTokens;
        this.save();
        return this.colonyVisual.drawSpecialTokens;
    }

    
    public update(empire: Empire): void {
        for (var i = 0; i < empire.colonies.length; i++) {
            this.colonyVisual.draw(empire.colonies[i]);
        }
        global.d.print();
        Memory.visuals.colony = this.colonyVisual.save();
    }

    public save(): void {
        Memory.visuals.colony = this.colonyVisual.save();
    }

}
