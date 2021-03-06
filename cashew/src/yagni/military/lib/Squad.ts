//import { Formation, FormationPosition, FormationMoveResult, FormationState } from "./Formation";
//import { TargetingTactics, TargetingTacticsRepository } from "./TargetingTactics";
//import { SquadMember, SquadMemberRepository } from "./SquadMember"

//export class Squad {
//    public static fromMemory(memory: SquadMemory): Squad {
//        let unit = new Squad(
//            memory.members.map(p => SquadMemberRepository.load(p)),
//            Formation.fromMemory(memory.formation),
//            TargetingTacticsRepository.load(memory.targetingTactics)
//        );
//        if (memory.rallying)
//            unit.rallying = Rally.fromMemory(memory.rallying);
//        unit.engaging = memory.engaging;
//        return unit;
//    }

//    constructor(members: SquadMember[], formation: Formation, targetingTactics: TargetingTactics) {
//        if (members.length != formation.positions.length + 1)
//            throw new Error("Must provide same number of unit members as formation has positions");

//        this.members = members;
//        this.formation = formation;        
//        this.targetingTactics = targetingTactics;
//    }


//    public members: SquadMember[];
//    public formation: Formation;
//    public targetingTactics: TargetingTactics;    
//    public rallying: Rally;
//    public engaging: boolean;    
//    public attackTargets: AttackableTarget[] = [];
//    public healTargets: Creep[] = [];
//    public position: RoomPosition;    
//    public get capacity(): number {
//        return this.formation.positions.length + 1;
//    }
//    public get enlisted(): number {
//        return _.sum(this.formation.positions, p => p.creep ? 1 : 0) + (this.formation.vanguard.creep ? 1 : 0);
//    }
//    public get openPositions(): number {
//        return _.sum(this.formation.positions, p => p.creep ? 0 : 1) + (this.formation.vanguard.creep ? 0 : 1);
//    }


//    public update(): void {
//        if (this.formation.vanguard.creep)
//            this.position = this.formation.vanguard.creep.pos;

//        if (this.engaging) {
//            this.attackTargets = this.targetingTactics.getAttackTargets(this);
//            this.healTargets = this.targetingTactics.getHealTargets(this);
//            this.members.forEach(p => p.update(this));
//        }
//    }

//    public execute(): void {
//        if (this.rallying && !this.rallying.complete)
//            this.rally();

//        if (this.engaging)
//            this.members.forEach(p => p.execute(this));
//    }

//    public cleanup(): void {     
//        if (this.engaging)
//            this.members.forEach(p => p.cleanup(this));
//    }


//    public assign(member: SquadMember, creepName: string): void {
//        member.creepName = creepName;
//        this.formation.assign(creepName, member.formationPosition);
//        let memory = Memory.creeps[creepName];
//        if (memory)
//            memory.operation = "military";
//    }

//    public getOpenMembers(): SquadMember[] {
//        let open = [];
//        for (var i = 0; i < this.members.length; i++)
//            if (!this.members[i].creepName)
//                open.push(this.members[i]);
//        return open;
//    }


//    public engage(): void {
//        this.engaging = true;
//    }

//    public disengage(): void {
//        this.engaging = false;
//    }


//    public canRallyTo(rallyPoint: RoomPosition): boolean {
//        return this.formation.canMoveTo(rallyPoint);
//    }

//    public rallyTo(rallyPoint: RoomPosition): void {
//        if (this.canRallyTo(rallyPoint))
//            this.rallying = new Rally(rallyPoint);        
//    }

//    public move(direction: DirectionConstant): FormationMoveResult {
//        return this.formation.move(direction);
//    }

//    public moveTo(pos: RoomPosition | { pos: RoomPosition }): FormationMoveResult {
//        return this.formation.moveTo(pos);
//    }


//    private rally(): void {
//        let moveResult = this.formation.moveTo(this.rallying.rallyPoint);
//        if (moveResult == FormationMoveResult.AtDestination) {
//            if (this.formation.getState() == FormationState.Exact)
//                this.rallying.complete = true;
//            else
//                this.formation.formUp();
//        }
//    }


//    public save(): SquadMemory {
//        return {
//            members: this.members.map(p => p.save()),
//            formation: this.formation.save(),
//            targetingTactics: this.targetingTactics.type,
//            rallying: this.rallying.save(),
//            engaging: this.engaging
//        };
//    }
//}

//export class Rally {
//    public static fromMemory(memory: RallyMemory): Rally {
//        let pos = new RoomPosition(memory.rallyPoint.x, memory.rallyPoint.y, memory.rallyPoint.roomName);
//        let rally = new this(pos);
//        rally.complete = memory.complete;
//        return rally;
//    }

//    constructor(rallyPoint: RoomPosition) {
//        this.rallyPoint = rallyPoint;
//    }

//    public rallyPoint: RoomPosition;
//    /** Is true when the unit is fully manned and in formation at the rally point. */
//    public complete: boolean;

//    public save(): RallyMemory {
//        return {
//            rallyPoint: this.rallyPoint,
//            complete: this.complete
//        };
//    }
//}

