import { Squad } from "./Squad"

export abstract class SquadMember {
    public static fromMemory(memory: UnitMemberMemory, instance: SquadMember): SquadMember {
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

    public abstract update(unit: Squad): void;
    public abstract execute(unit: Squad): void;
    public abstract cleanup(unit: Squad): void;

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

export class SquadMemberRepository {
    public static register(unitMemberType: UnitMemberType, loadDelegate: (memory: UnitMemberMemory) => SquadMember) {
        SquadMemberRepository.delegates[unitMemberType] = loadDelegate;
    }

    public static load(memory: UnitMemberMemory): SquadMember {
        return SquadMemberRepository.delegates[memory.type](memory);
    }

    private static delegates: { [unitMemberType: string]: (memory: any) => SquadMember } = {};
}
