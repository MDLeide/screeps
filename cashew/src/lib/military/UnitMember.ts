import { Unit } from "./Unit"

export abstract class UnitMember {
    public static fromMemory(memory: UnitMemberMemory, instance: UnitMember): UnitMember {
        instance.freeToMove = memory.freeToMove;
        instance.bodyType = memory.bodyType;
        instance.formationPosition = memory.formationPosition;
        instance.creepName = memory.creepName;
        if (instance.creepName)
            instance.creep = Game.creeps[instance.creepName];
        if (!instance.creep)
            instance.creepName = undefined;
        return instance;
    }

    constructor(type: UnitMemberType, bodyType: BodyType, formationPosition: string) {
        this.type = type;
        this.bodyType = bodyType;
        this.formationPosition = formationPosition;
    }

    public type: UnitMemberType;
    public freeToMove: boolean;
    public bodyType: BodyType;
    public formationPosition: string;
    public creepName: string;
    public creep: Creep;

    public abstract update(unit: Unit): void;
    public abstract execute(unit: Unit): void;
    public abstract cleanup(unit: Unit): void;

    public save(): UnitMemberMemory {
        return {
            type: this.type,
            freeToMove: this.freeToMove,
            bodyType: this.bodyType,
            formationPosition: this.formationPosition,
            creepName: this.creepName
        };
    }
}

export class UnitMemberRepository {
    public static register(unitMemberType: UnitMemberType, loadDelegate: (memory: UnitMemberMemory) => UnitMember) {
        this.delegates[unitMemberType] = loadDelegate;
    }

    public static load(memory: UnitMemberMemory): UnitMember {
        return this.delegates[memory.type](memory);
    }

    private static delegates: { [unitMemberType: string]: (memory: any) => UnitMember } = {};
}
