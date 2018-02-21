import { StringBuilder } from "./StringBuilder";

export class EventLog {
    constructor(colors?: Colors) {
        if (!colors)
            colors = new Colors();
        this.empire = new EmpireEvents(colors, this);
        this.colony = new ColonyEvents(colors, this);
        this.operation = new OperationEvents(colors, this);
        this.creep = new CreepEvents(colors, this);
        this.debug = new DebugEvents(colors, this);
    }

    public mute: boolean = false;
    /** Minimum message level for all events.
    A message's level must be greater than
    this number to be printed. Lower number means
    more messages */
    public messageLevel: number = 4;    

    public empire: EmpireEvents;
    public colony: ColonyEvents;
    public operation: OperationEvents;
    public creep: CreepEvents;
    public debug: DebugEvents;

    public log(msg: string, level: number, category: string): void {
        if (this.mute)
            return;
        if (level < this.messageLevel)
            return;
        var sb = new StringBuilder();
        sb.append(category, 'orange')
            .append(" ")
            .append(level.toString(), 'lightBlue');
        console.log(`[${sb.getString()}] : ${msg}`);
    }
}

class Colors {
    default: string = "#777777";
    identifier: string = "#006000";
    name: string = "#AAAAFF";
    importantPositiveVerb: string = "#FF7F00";
    importantNegativeVerb: string ="#DD0000";
    positiveVerb: string = "#DDDD00";
    negativeVerb: string = "#800080";
    neutralVerb: string ="#D2B48C";
}

abstract class EventGroup {
    private eventLog: EventLog;
    constructor(colors: Colors, eventLog: EventLog) {
        this.colors = colors;
        this.eventLog = eventLog;
    }

    public mute: boolean = false;
    /** Minimum message level for this event group.
    A message's level must be greater than
    this number to be printed. Lower number means
    more messages */
    public messageLevel: number = 0;
    public colors: Colors;

    protected abstract getCategory(): string;

    protected log(msg: string, level: number): void {
        if (this.mute)
            return;
        if (level < this.messageLevel)
            return;
        this.eventLog.log(msg, level, this.getCategory());
    }
}

class EmpireEvents extends EventGroup {
    public colonyEstablishedLevel: number = 10;
    public nestMappingFailedLevel: number = 10;
    public gclUpgradedLevel: number = 10;

    protected getCategory(): string {
        return "Empire";
    }

    public colonyEstablished(colonyName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(colonyName, this.colors.name);
        sb.append(" has been established", this.colors.importantPositiveVerb);

        this.log(sb.getString(), this.colonyEstablishedLevel);
    }

    public nestMappingFailed(nestName: string, blockName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Map Builder", this.colors.identifier);
        sb.append(" failed to create ", this.colors.importantNegativeVerb);
        sb.append(blockName, this.colors.identifier);
        sb.append(" for ");
        sb.append("Nest ", this.colors.identifier);
        sb.append(nestName, this.colors.name);

        this.log(sb.getString(), this.nestMappingFailedLevel);
    }

    public gclUpgraded(newLevel: number) {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("The Empire has risen to ", this.colors.importantPositiveVerb);
        sb.append("GCL ", this.colors.identifier);
        sb.append(newLevel.toString(), this.colors.name);

        this.log(sb.getString(), this.gclUpgradedLevel);
    }
}

class ColonyEvents extends EventGroup {
    public creepSpawnLevel: number = 3;
    public rclUpgradeLevel: number = 9;
    public underAttackLevel: number = 10;
    public milestoneMetLevel: number = 9;

    protected getCategory(): string {
        return "Colony";
    }

    public creepSpawning(colonyName: string, creepName: string, bodyType: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(colonyName, this.colors.name);
        sb.append(" is ");
        sb.append("spawning", this.colors.positiveVerb);
        sb.append(" a ");
        sb.append("creep", this.colors.identifier);
        sb.append(" named ");
        sb.append(creepName, this.colors.name);
        sb.append(" with a ");
        sb.append("body", this.colors.identifier);
        sb.append(" type of ");
        sb.append(bodyType, this.colors.name);

        this.log(sb.getString(), this.creepSpawnLevel);
    }

    public rclUpgrade(colonyName: string, newLevel: number): void {

    }

    public underAttack(colonyName: string): void {

    }

    public milestoneMet(colonyName: string, milestoneName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(colonyName, this.colors.name);
        sb.append(" has met the ", this.colors.importantPositiveVerb);
        sb.append("milestone ", this.colors.identifier);        
        sb.append(milestoneName, this.colors.name);        

        this.log(sb.getString(), this.milestoneMetLevel);
    }
}

class OperationEvents extends EventGroup {
    public initLevel: number = 4;
    public startLevel: number = 5;
    public finishLevel: number = 7;

    public failedInitLevel: number = 4;
    public failedStartLevel: number = 5;
    public failedFinishLevel: number = 7;

    public creepAssignedLevel: number = 2;
    public creepAssignmentFailedLevel: number = 6;
    public creepReleasedLevel: number = 2;

    protected getCategory(): string {
        return "Operation";
    }

    public init(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("initialized", this.colors.neutralVerb);        

        this.log(sb.getString(), this.initLevel);
    }

    public start(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("started", this.colors.positiveVerb);

        this.log(sb.getString(), this.startLevel);
    }

    public finish(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("finished", this.colors.positiveVerb);

        this.log(sb.getString(), this.finishLevel);
    }


    public failedToInit(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to initialize", this.colors.negativeVerb);

        this.log(sb.getString(), this.failedInitLevel);
    }

    public failedToStart(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to start", this.colors.negativeVerb);

        this.log(sb.getString(), this.failedStartLevel);
    }

    public failedToFinish(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to finish", this.colors.negativeVerb);

        this.log(sb.getString(), this.failedFinishLevel);
    }



    public creepAssigned(operationName: string, creepName: string, bodyType: string, roleName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" was assigned to ", this.colors.neutralVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" in the ");
        sb.append("role", this.colors.identifier);
        sb.append(" of ");
        sb.append(roleName, this.colors.name);

        this.log(sb.getString(), this.creepAssignedLevel);
    }

    public creepAssignmentFailed(operationName: string, creepName: string, bodyType: string) {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" failed to assign to ", this.colors.negativeVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);

        this.log(sb.getString(), this.creepAssignmentFailedLevel);
    }

    public creepReleased(operationName: string, creepName: string): void {

    }
}

class CreepEvents extends EventGroup {
    public bornLevel: number = 2;
    public diedLevel: number = 2;
    public roleErrorLevel: number = 1;

    protected getCategory(): string {
        return "Creep";
    }

    public born(creepName: string, bodyType: string, roleName: string, colonyName: string): void {

    }

    public died(creepName: string, roleName: string, colonyName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier)
            .append(creepName, this.colors.name)
            .append(" died ", this.colors.neutralVerb)
            .append("while in the ")
            .append("role ", this.colors.identifier)
            .append(roleName, this.colors.name)
            .append(" in ")
            .append("colony ", this.colors.identifier)
            .append(colonyName, this.colors.name);

        this.log(sb.getString(), this.diedLevel);
    }

    public roleError(creepName: string, roleName: string, error: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier)
            .append(creepName, this.colors.name)            
            .append(" in the ")
            .append("role ", this.colors.identifier)
            .append(roleName, this.colors.name)
            .append(" encountered an error ", this.colors.negativeVerb)
            .append(error, this.colors.name);

        this.log(sb.getString(), this.roleErrorLevel);
    }
}

class DebugEvents extends EventGroup {
    protected getCategory(): string {
        return "Debug";
    }

    public playbackStart(): void {

    }

    public playbackStop(): void {

    }
}


