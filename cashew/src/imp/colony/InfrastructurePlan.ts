import { OperationPlan } from "../../lib/colony/OperationPlan";
import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";

import { HarvestInfrastructureOperation } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { ExtensionConstructionOperation } from "../operation/infrastructure/ExtensionsOperation";

import { ExtractorConstructionOperation } from "../operation/infrastructure/ExtractorConstructionOperation";
import { LabConstructionOperation } from "../operation/infrastructure/LabConstructionOperation";
import { ObserverConstructionOperation } from "../operation/infrastructure/ObserverConstructionOperation";
import { TerminalConstructionOperation } from "../operation/infrastructure/TerminalConstructionOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { TowerConstructionOperation } from "../operation/infrastructure/TowerConstructionOperation";

import { HarvestLinkConstructionOperation } from "../operation/infrastructure/HarvestLinkConstructionOperation";
import { UpgradeLinkConstructionOperation } from "../operation/infrastructure/UpgradeLinkConstruction";
import { ExtensionLinkConstruction } from "../operation/infrastructure/ExtensionLinkConstruction";
import { StorageLinkConstructionOperation } from "../operation/infrastructure/StorageLinkConstructionOperation";

import { WallConstructionOperation } from "../operation/infrastructure/WallConstructionOperation";

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
                this.addOperation(new ExtensionConstructionOperation(2));
                this.addOperation(new WallConstructionOperation());
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
                this.addOperation(new ExtensionConstructionOperation(3));
                break;
                
            case "rcl4":
                this.addOperation(new StorageConstructionOperation());
                break;

            case "storage":
                this.addOperation(new ExtensionConstructionOperation(4));
                break;

            case "rcl5":
                this.addOperation(new TowerConstructionOperation(5));
                break;

            case "secondTower":
                this.addOperation(new HarvestLinkConstructionOperation(colony.resourceManager.sourceAId));
                this.addOperation(new UpgradeLinkConstructionOperation());
                break;

            case "firstLinks":
                this.addOperation(new ExtensionConstructionOperation(5));
                break;

            case "rcl6":
                this.addOperation(new ExtensionConstructionOperation(6));
                this.addOperation(new ExtensionLinkConstruction());
                break;

            case "thirdLink":
                this.addOperation(new ExtractorConstructionOperation());
                break;

            case "extractor":
                this.addOperation(new TerminalConstructionOperation());
                break;

            case "terminal":
                this.addOperation(new LabConstructionOperation(6));
                break;

            case "firstLabs":                
                break;

            case "rcl7":
                this.addOperation(new TowerConstructionOperation(7));
                this.addOperation(new ExtensionConstructionOperation(7));
                break;

            case "thirdTower":
                this.addOperation(new HarvestLinkConstructionOperation(colony.resourceManager.sourceBId));
                break;

            case "fourthLink":
                this.addOperation(new LabConstructionOperation(7));
                break;

            case "sixthLab":
                break;

            case "rcl8":
                this.addOperation(new ExtensionConstructionOperation(8));
                this.addOperation(new TowerConstructionOperation(8));
                break;

            case "sixthTower":
                this.addOperation(new ObserverConstructionOperation());
                break;

            case "observer":
                this.addOperation(new StorageLinkConstructionOperation());
                break;

            case "storageLink":
                this.addOperation(new LabConstructionOperation(8));
                break;

            case "labs":
                break;

            default:
                throw Error(`argument out of range: ${milestoneId}`);
        }
    }
}
