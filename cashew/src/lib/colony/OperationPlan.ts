import { Colony } from "./Colony";
import { Operation } from "../operation/Operation";
import { OperationGroup } from "../operation/OperationGroup";

/**
 * Wraps an operation group to support adding/removing operations based on Colony state.
 */
export abstract class OperationPlan {
    public static fromMemory(memory: OperationPlanMemory, instance: OperationPlan): OperationPlan {
        instance.operationGroup = OperationGroup.fromMemory(memory.operationGroup);
        return instance;
    }


    constructor(type: PlanType) {
        this.type = type;
        this.operationGroup = new OperationGroup([]);
    }


    public type: PlanType;
    public operationGroup: OperationGroup;


    public load(): void {
        this.onLoad();
        this.operationGroup.load();
    }

    public update(colony: Colony): void {
        this.onUpdate(colony);
        this.operationGroup.update(colony);
    }

    public execute(colony: Colony): void {
        this.onExecute(colony);
        this.operationGroup.execute(colony);
    }

    public cleanup(colony: Colony): void {
        this.onCleanup(colony);
        this.operationGroup.cleanup(colony);
    }


    protected addOperation(operation: Operation): void {
        this.operationGroup.addOperation(operation);
    }

    protected cancelOperation(operation: Operation): void {
        this.operationGroup.cancelOperation(operation);
    }

    /** Cancels all operations of the given type. */
    protected cancelOperationsByType(type: OperationType): void {
        this.operationGroup.cancelOperationByType(type);
    }


    protected abstract onLoad(): void;
    protected abstract onUpdate(colony: Colony): void;
    protected abstract onExecute(colony: Colony): void;
    protected abstract onCleanup(colony: Colony): void;


    public save(): OperationPlanMemory {
        return {
            type: this.type,
            operationGroup: this.operationGroup.save()
        };
    }
}

export class OperationPlanRepository {
    public static register(planType: PlanType, loadDelegate: (memory: OperationPlanMemory) => OperationPlan, newDelegate: () => OperationPlan) {
        this.loadDelegates[planType] = loadDelegate;
        this.newDelegates[planType] = newDelegate;
    }

    public static load(memory: OperationPlanMemory): OperationPlan {
        return this.loadDelegates[memory.type](memory);
    }

    public static getNew(planType: PlanType): OperationPlan {
        return this.newDelegates[planType]();
    }

    private static loadDelegates: { [planType: string]: (memory: any) => OperationPlan } = {};
    private static newDelegates: { [planType: string]: () => OperationPlan } = {};
}
