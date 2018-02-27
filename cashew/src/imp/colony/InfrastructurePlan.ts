import { OperationPlan } from "../../lib/colony/OperationPlan";
import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";

import { HarvestInfrastructureOperation } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { ExtensionConstruction } from "../operation/infrastructure/ExtensionsOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { TowerConstructionOperation } from "../operation/infrastructure/TowerConstructionOperation";

export class InfrastructurePlan extends OperationPlan {
    public static fromMemory(memory: OperationPlanMemory): InfrastructurePlan {
        let plan = new this();
        return OperationPlan.fromMemory(memory, plan) as InfrastructurePlan;
    }


    constructor() {
        super(PLAN_INFRASTRUCTURE);
    }

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        if (colony.progress.newMilestoneThisTick)
            this.manageMilestone(colony, colony.progress.mostRecentMilestone.id);
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    private manageMilestone(colony: Colony, milestoneId: string): void {
        switch (milestoneId) {
            case "spawn":
                let sources = colony.nest.room.find(FIND_SOURCES);
                for (var i = 0; i < sources.length; i++)
                    this.addOperation(new HarvestInfrastructureOperation(sources[i].id));
                break;

            case "harvestContainers":
                break;

            case "rcl2":
                this.addOperation(new ExtensionConstruction(2));
                break;

            case "fiveExtensions":
                this.addOperation(new ControllerInfrastructureOperation());
                break;

            case "upgradeContainer":
                break;

            case "rcl3":
                this.addOperation(new TowerConstructionOperation(3));
                break;

            case "firstTower":
                this.addOperation(new ExtensionConstruction(3));
                break;
                
            case "rcl4":
                this.addOperation(new StorageConstructionOperation());
                break;

            case "storage":
                this.addOperation(new ExtensionConstruction(4));
                break;

            case "rcl5":
                this.addOperation(new TowerConstructionOperation(5));
                break;

            case "secondTower":
                break;

            case "firstLinks":
                break;

            default:
                throw Error(`argument out of range: ${milestoneId}`);
        }
    }
}
