import { Colony } from "../../colony/Colony";
import { EnergyStatsVisual } from "./EnergyStatsVisual";
import { NestMapVisual } from "./NestMapVisual";
import { VisualText } from "./lib/VisualText";

export class ColonyVisual {
    public static fromMemory(memory: ColonyVisualMemory): ColonyVisual {
        let v = new this();
        v.drawDetailOperations = memory.drawDetailOperations;
        v.drawDetailedPopulation = memory.drawDetailedPopulation;
        v.drawSpecialTokens = memory.drawSpecialTokens;
        v.drawEnergyStats = memory.drawEnergyStats;
        v.drawGeneralInfo = memory.drawGeneralInfo;
        v.drawStructures = memory.drawStructures;
        return v;
    }

    constructor() {        
    }

    public drawGeneralInfo: boolean = true;

    public drawStructures: boolean;    
    public drawSpecialTokens: boolean;

    public drawEnergyStats: boolean = true;
    public drawDetailedPopulation: boolean;
    public drawDetailOperations: boolean;


    public draw(colony: Colony): void {
        if (this.drawGeneralInfo) {
            let vt = this.getGeneralText(colony);
            vt.alignCenter();
            vt.draw(25.5, 0, colony.nest.roomName);
        }
        if (this.drawStructures) {
            let nestMapVisual = new NestMapVisual(colony.nest.roomName, colony.nest.nestMap);
            nestMapVisual.drawStructures();
        }            
        if (this.drawSpecialTokens) {
            let nestMapVisual = new NestMapVisual(colony.nest.roomName, colony.nest.nestMap);
            nestMapVisual.drawRcl();
        }
        if (this.drawEnergyStats) {
            EnergyStatsVisual.draw(colony, 5, 1);
        }
        if (this.drawDetailedPopulation) {
            let vt = this.getDetailedPopulation(colony);
        }
        if (this.drawDetailOperations) {
            let vt = this.getDetailedOperations(colony);
        }            
    }

    private getGeneralText(colony: Colony): VisualText {
        let vt = new VisualText();
        vt.append(colony.nest.roomName);
        vt.append("  |  ");
        vt.append(colony.progress.mostRecentMilestone.name);
        vt.append("  |  ");
        let ops = _.sum(colony.operationPlans, p => p.operationGroup.operations.length);
        vt.append(ops + " operations");
        let pop = colony.population.alive.length;
        vt.append("  |  ");
        vt.append(pop + " creeps");
        return vt;
    }

    private getDetailedPopulation(colony: Colony): VisualText {
        let vt = new VisualText();
        return vt;
    }

    private getDetailedOperations(colony: Colony): VisualText {
        let vt = new VisualText();
        return vt;
    }    

    public save(): ColonyVisualMemory {
        return {
            drawDetailOperations: this.drawDetailOperations,
            drawDetailedPopulation: this.drawDetailedPopulation,
            drawSpecialTokens: this.drawSpecialTokens,
            drawEnergyStats: this.drawEnergyStats,
            drawGeneralInfo: this.drawGeneralInfo,
            drawStructures: this.drawStructures
        };
    }
}


