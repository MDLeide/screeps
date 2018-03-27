import { Squad } from "./Squad";

export abstract class TargetingTactics {
    constructor(type: TargetingTacticsType) {
        this.type = type;
    }

    public type: TargetingTacticsType;
    public abstract getAttackTargets(unit: Squad): AttackableTarget[];
    public abstract getHealTargets(unit: Squad): Creep[];
}

export class TargetingTacticsRepository {
    public static register(targetingTacticsType: TargetingTacticsType, loadDelegate: () => TargetingTactics) {
        this.delegates[targetingTacticsType] = loadDelegate;
    }

    public static load(type: TargetingTacticsType): TargetingTactics {
        return this.delegates[type]();
    }

    private static delegates: { [targetingTacticsType: string]: () => TargetingTactics } = {};
}
