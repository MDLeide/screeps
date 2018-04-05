//import { Colony } from "./Colony";

///**
// * Describes the progress of a Colony using Milestones.
// */
//export class ColonyProgress {
//    public static fromMemory(memory: ColonyProgressMemory, milestones: Milestone[]) {
//        let progress = new this(memory.type, milestones);
//        progress.milestoneIndex = memory.milestoneIndex;
//        return progress;
//    }


//    constructor(
//        type: ProgressType,
//        milestones: Milestone[]) {
//        this.type = type;
//        this.milestones = milestones;
//    }


//    public type: ProgressType;
//    public milestones: Milestone[];
//    public milestoneIndex: number = -1;
//    public newMilestoneThisTick: boolean = false;
//    public get mostRecentMilestone(): Milestone { return this.milestoneIndex >= 0 ? this.milestones[this.milestoneIndex] : null; }


//    public load(): void {
//    }

//    public update(colony: Colony): void {
//        this.checkForNewMilestone(colony);
//    }

//    public execute(colony: Colony): void { }
//    public cleanup(colony: Colony): void { }


//    private checkForNewMilestone(colony: Colony): void {
//        if (this.isNextMilestoneMet(colony))
//            this.advanceMilestone(colony);
//    }

//    private isNextMilestoneMet(colony: Colony) {
//        return this.milestoneIndex + 1 < this.milestones.length && // there is another milestone in the list
//            this.milestones[this.milestoneIndex + 1].isMet(colony); // and it is met
//    }

//    private advanceMilestone(colony: Colony) {
//        this.milestoneIndex++;
//        this.newMilestoneThisTick = true;
//        global.events.colony.milestoneMet(colony.name, this.mostRecentMilestone.name);
//    }

//    public save(): ColonyProgressMemory {
//        return {
//            type: this.type,
//            milestoneIndex: this.milestoneIndex
//        };
//    }
//}

//export class ColonyProgressRepository {
//    public static register(progressType: ProgressType, loadDelegate: (memory: ColonyProgressMemory) => ColonyProgress, newDelegate: () => ColonyProgress) {
//        this.loadDelegates[progressType] = loadDelegate;
//        this.newDelegates[progressType] = newDelegate;
//    }

//    public static load(memory: ColonyProgressMemory): ColonyProgress {
//        return this.loadDelegates[memory.type](memory);
//    }

//    public static getNew(type: ProgressType): ColonyProgress {
//        return this.newDelegates[type]();
//    }

//    private static loadDelegates: { [type: string]: (memory: any) => ColonyProgress } = {};
//    private static newDelegates: { [type: string]: () => ColonyProgress } = {};
//}

//export class Milestone {
//    private _isMetDelegate: (colony: Colony) => boolean;

//    constructor(id: string, name: string, isMetDelegate: (colony: Colony) => boolean) {
//        this._isMetDelegate = isMetDelegate;
//        this.id = id;
//        this.name = name;
//    }

//    public id: string;
//    public name: string;

//    public isMet(colony: Colony): boolean {
//        return this._isMetDelegate(colony);
//    }
//}
