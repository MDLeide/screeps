import { OperationPlan } from "../../lib/colony/OperationPlan";
import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";

import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";

export class EconomyPlan extends OperationPlan {
    public static fromMemory(memory: OperationPlanMemory): EconomyPlan {
        let plan = new this();
        return OperationPlan.fromMemory(memory, plan) as EconomyPlan;
    }

    constructor() {
        super(PLAN_ECONOMY);
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
                break;

            case "harvestContainers":
                let sources = colony.nest.room.find(FIND_SOURCES);
                this.addOperation(new HarvestOperation(300, colony.resourceManager.sourceAId, colony.resourceManager.sourceAContainerOrLinkId));
                if (colony.resourceManager.sourceBId)
                    this.addOperation(new HarvestOperation(300, colony.resourceManager.sourceBId, colony.resourceManager.sourceBContainerOrLinkId));
                
                this.addOperation(new LightUpgradeOperation());
                break;

            case "rcl2":
                break;

            case "fiveExtensions":
                this.addOperation(new EnergyTransportOperation());
                break;

            case "upgradeContainer":
                this.cancelOperationsByType(OPERATION_LIGHT_UPGRADE);
                this.addOperation(new HeavyUpgradeOperation());
                break;
                
            case "rcl3":
                break;

            case "firstTower":
                break;

            case "rcl4":
                break;

            case "storage":
                break;

            case "rcl5":
                break;

            case "secondTower":
                break;

            case "firstLinks":
                // update operations with the link id
                for (var i = 0; i < this.operationGroup.operations.length; i++) {
                    if (this.operationGroup.operations[i].type == OPERATION_HARVEST) {
                        let harvestOp = this.operationGroup.operations[i] as HarvestOperation;
                        if (harvestOp.sourceId == colony.resourceManager.sourceAId) {
                            harvestOp.changeContainerOrLink(colony.resourceManager.sourceAContainerOrLinkId);
                        }
                    }
                }                
                break;

            case "rcl6":
                break;

            case "thirdLink":
                for (var i = 0; i < this.operationGroup.operations.length; i++) {
                    if (this.operationGroup.operations[i].type == OPERATION_HARVEST) {
                        let harvestOp = this.operationGroup.operations[i] as HarvestOperation;
                        if (harvestOp.sourceId == colony.resourceManager.sourceBId) {
                            harvestOp.changeContainerOrLink(colony.resourceManager.sourceBContainerOrLinkId);
                        }
                    }
                }   
                break;

            case "extractor":
                //todo: start extraction operation
                break;

            case "terminal":
                //todo: start market operations
                break;

            case "firstLabs":
                //todo: start lab operations
                break;
                
            case "rcl7":
                break;

            case "thirdTower":
                break;

            case "fourthLink":
                break;

            case "sixthLab":
                break;

            case "rcl8":
                break;

            case "sixthTower":
                break;

            case "observer":
                break;

            case "storageLink":
                break;

            case "labs":
                break;

            default:
                throw Error(`argument out of range: ${milestoneId}`);
        }
    }
}
