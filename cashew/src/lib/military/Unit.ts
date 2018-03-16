import { Formation, FormationPosition, FormationMoveResult, FormationState, FormationMemory } from "./Formation";
import { TargetingTactics, TargetingTacticsRepository } from "./TargetingTactics";
import { UnitMember, UnitMemberRepository } from "./UnitMember"

export class Unit {
    public static fromMemory(memory: UnitMemory): Unit {
        let unit = new this(
            memory.members.map(p => UnitMemberRepository.load(p)),
            Formation.fromMemory(memory.formation),
            TargetingTacticsRepository.load(memory.targetingTactics)
        );
        unit.rallying = Rally.fromMemory(memory.rallying);
        unit.engaging = memory.engaging;
        return unit;
    }

    constructor(members: UnitMember[], formation: Formation, targetingTactics: TargetingTactics) {
        if (members.length != formation.positions.length + 1)
            throw new Error("Must provide same number of unit members as formation has positions");

        this.members = members;
        this.formation = formation;        
        this.targetingTactics = targetingTactics;
    }


    public members: UnitMember[];
    public formation: Formation;
    public targetingTactics: TargetingTactics;
    
    public rallying: Rally;
    public engaging: boolean;
    
    public attackTargets: AttackableTarget[] = [];
    public healTargets: Creep[] = [];
    
    public get capacity(): number {
        return this.formation.positions.length + 1;
    }
    public get enlisted(): number {
        return _.sum(this.formation.positions, p => p.creep ? 1 : 0) + (this.formation.vanguard.creep ? 1 : 0);
    }
    public get openPositions(): number {
        return _.sum(this.formation.positions, p => p.creep ? 0 : 1) + (this.formation.vanguard.creep ? 0 : 1);
    }


    public update(): void {
        if (this.engaging) {
            this.attackTargets = this.targetingTactics.getAttackTargets(this);
            this.healTargets = this.targetingTactics.getHealTargets(this);
            this.members.forEach(p => p.update(this));
        }
    }

    public execute(): void {
        if (this.rallying && !this.rallying.complete)
            this.rally();

        if (this.engaging)
            this.members.forEach(p => p.execute(this));
    }

    public cleanup(): void {     
        if (this.engaging)
            this.members.forEach(p => p.cleanup(this));
    }

    public assign(member: UnitMember, creepName: string): void {
        member.creepName = creepName;
        this.formation.assign(creepName, member.formationPosition);
    }

    public getOpenMembers(): UnitMember[] {
        let open = [];
        for (var i = 0; i < this.members.length; i++)
            if (!this.members[i].creepName)
                open.push(this.members[i]);
        return open;
    }

    public engage(): void {
        this.engaging = true;
    }

    public disengage(): void {
        this.engaging = false;
    }

    public canRallyTo(rallyPoint: RoomPosition): boolean {
        return this.formation.canMoveTo(rallyPoint);
    }

    public rallyTo(rallyPoint: RoomPosition): void {
        this.rallying = new Rally(rallyPoint);        
    }

    public move(direction: DirectionConstant): FormationMoveResult {
        return this.formation.move(direction);
    }

    public moveTo(pos: RoomPosition | { pos: RoomPosition }): FormationMoveResult {
        return this.formation.moveTo(pos);
    }
        
    private rally(): void {
        let moveResult = this.formation.moveTo(this.rallying.rallyPoint);
        if (moveResult == FormationMoveResult.AtDestination) {
            if (this.formation.getState() == FormationState.Exact)
                this.rallying.complete = true;
            else
                this.formation.formUp();
        }
    }

    public save(): UnitMemory {
        return {
            members: this.members.map(p => p.save()),
            formation: this.formation.save(),
            targetingTactics: this.targetingTactics.type,
            rallying: this.rallying.save(),
            engaging: this.engaging
        };
    }
}

export class Rally {
    public static fromMemory(memory: RallyMemory): Rally {
        let rally = new this(memory.rallyPoint);
        rally.complete = memory.complete;
        return rally;
    }

    constructor(rallyPoint: RoomPosition) {
        this.rallyPoint = rallyPoint;
    }

    public rallyPoint: RoomPosition;
    /** Is true when the unit is fully manned and in formation at the rally point. */
    public complete: boolean;

    public save(): RallyMemory {
        return {
            rallyPoint: this.rallyPoint,
            complete: this.complete
        };
    }
}

