import { StringBuilder } from "./StringBuilder";
import { NestStructureVisual } from "../visual/NestStructureVisual";
import { NestMap } from "../map/NestMap";
import { System } from "lib/System";
import { LinkGenerator } from "./LinkGenerator";
import { Order, Transaction } from "../empire/Exchange";

export class EventLog {
    private groupNameWidth: number = 5;

    constructor(colors?: Colors) {
        if (!colors)
            colors = new Colors();
        this.empire = new EmpireEvents(colors, this);
        this.colony = new ColonyEvents(colors, this);
        this.operation = new OperationEvents(colors, this);
        this.creep = new CreepEvents(colors, this);
        this.debug = new DebugEvents(colors, this);
        this.remoteMining = new RemoteMiningEvents(colors, this);
        this.system = new SystemEvents(colors, this);

        this.setGroupWidth([
            this.empire,
            this.colony,
            this.operation,
            this.creep,
            this.debug,
            this.remoteMining,
            this.system
        ]);        
    }
    
    public help(): string {
        return "mute: boolean - mutes all events</br>" +
            "messageLevel: number - verbosity level</br>" +
            "empire, colony, operation, creep, debug - event groups";
    }

    public mute: boolean = false;
    /** Minimum message level for all events.
    A message's level must be greater than
    this number to be printed. Lower number means
    more messages */
    public messageLevel: number = 0;
    /** If true, rooms will be converted to HTML links in the console output. */
    public linkRooms: boolean = true;

    public empire: EmpireEvents;
    public colony: ColonyEvents;
    public operation: OperationEvents;
    public creep: CreepEvents;
    public debug: DebugEvents;
    public remoteMining: RemoteMiningEvents;
    public system: SystemEvents;

    public log(msg: string, level: number, category: string): void {
        if (this.mute) return;
        if (level < this.messageLevel) return;

        var sb = new StringBuilder();
        let pad = this.groupNameWidth - category.length;
        for (var i = 0; i < pad; i++)
            category = category + " ";        

        sb.append(category, 'orange')
            .append(" ")
            .append(level.toString(), 'lightBlue');
        console.log(`[${sb.toString()}] : ${msg}`);
    }

    private setGroupWidth(groups: EventGroup[]): void {
        for (var i = 0; i < groups.length; i++)
            this.groupNameWidth = Math.max(this.groupNameWidth, groups[i].name.length);        
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
    neutralVerb: string = "#D2B48C";
    information: string = "#AAAAFF";
}

abstract class EventGroup {
    private eventLog: EventLog;
    constructor(colors: Colors, eventLog: EventLog, groupName: string) {
        this.colors = colors;
        this.eventLog = eventLog;
        this.name = groupName;
    }

    public mute: boolean = false;
    /** Minimum message level for this event group.
    A message's level must be greater than
    this number to be printed. Lower number means
    more messages */
    public messageLevel: number = 0;
    public colors: Colors;
    public name: string;

    protected log(msg: string, level: number): void {
        if (this.mute)
            return;
        if (level < this.messageLevel)
            return;
        this.eventLog.log(msg, level, this.name);
    }

    protected room(roomName: string): string {
        if (this.eventLog.linkRooms)
            return LinkGenerator.linkRoom(roomName);
        else
            return roomName;
    }

    protected colony(colonyName: string): string {
        if (!this.eventLog.linkRooms)
            return colonyName;
        let colony = global.empire.getColonyByName(colonyName);
        if (!colony)
            return colonyName;
        return LinkGenerator.linkRoom(colony.nest.roomName, colonyName);            
    }    
}

class EmpireEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Empire");
    }

    public colonyEstablishedLevel: number = 10;
    public colonyFailedToEstablishLevel: number = 10;
    public colonyRemovedLevel: number = 10;
    public nestMappingFailedLevel: number = 10;
    public gclUpgradedLevel: number = 10;
    

    public colonyEstablished(colonyName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" has been established", this.colors.importantPositiveVerb);

        this.log(sb.toString(), this.colonyEstablishedLevel);
    }

    public colonyFailedToEstablish(roomName: string, msg: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony at room ", this.colors.identifier);
        sb.append(this.room(roomName), this.colors.name);
        sb.append(" has failed to establish", this.colors.importantNegativeVerb);
        sb.append(" : ");
        sb.append(msg, this.colors.information);

        this.log(sb.toString(), this.colonyFailedToEstablishLevel);
    }

    public nestMappingFailed(nestMap: NestMap, nestName: string, blockName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Map Builder", this.colors.identifier);
        sb.append(" failed to create ", this.colors.importantNegativeVerb);
        sb.append(blockName, this.colors.name);
        sb.append(" for ");
        sb.append("Nest ", this.colors.identifier);
        sb.append(nestName, this.colors.name);

        this.log(sb.toString(), this.nestMappingFailedLevel);
    }

    public gclUpgraded(newLevel: number) {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("The Empire has risen to ", this.colors.importantPositiveVerb);
        sb.append("GCL ", this.colors.identifier);
        sb.append(newLevel.toString(), this.colors.name);

        this.log(sb.toString(), this.gclUpgradedLevel);
    }

    public colonyRemoved(colonyName: string, msg?: string): void {
        var sb = new StringBuilder();
        sb.append("Colony ", this.colors.identifier);
        sb.append(colonyName, this.colors.name);
        sb.append(" was removed from the Empire", this.colors.importantNegativeVerb);
        if (msg) {
            sb.append(": ");
            sb.append(msg, this.colors.information);
        }

        this.log(sb.toString(), this.colonyRemovedLevel);
    }
}

class ExchangeEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "exchange");
    }

    public orderCreated(order: Order): void {

    }

    public transactionCreated(transaction: Transaction): void {

    }
}

class ColonyEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Colony");
    }

    public creepSpawnLevel: number = 3;
    public creepScheduledLevel: number = 3;
    public creepRequestFailedLevel: number = 5;
    public spawnErrorLevel: number = 5;    
    public rclUpgradeLevel: number = 9;
    public underAttackLevel: number = 10;
    public milestoneMetLevel: number = 9;

    public creepSpawning(colonyName: string, creepName: string, bodyType: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
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

        this.log(sb.toString(), this.creepSpawnLevel);
    }

    public creepScheduled(colonyName: string, creepName: string, bodyType: string, requestingColony?: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" has ");
        sb.append("scheduled spawning of a ", this.colors.positiveVerb);
        sb.append("creep", this.colors.identifier);
        sb.append(" named ");
        sb.append(creepName, this.colors.name);
        if (requestingColony && requestingColony != colonyName) {
            sb.append(" in support of ", this.colors.positiveVerb);
            sb.append(this.colony(requestingColony), this.colors.name)
        }
        sb.append(" with a ");
        sb.append("body", this.colors.identifier);
        sb.append(" type of ");
        sb.append(bodyType, this.colors.name);

        this.log(sb.toString(), this.creepScheduledLevel);
    }

    public spawnError(spawnName: string, bodyType: string, error: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Spawn ", this.colors.identifier);
        sb.append(spawnName, this.colors.name);        
        sb.append(" failed to spawn ", this.colors.negativeVerb);
        sb.append("a ");
        sb.append("creep", this.colors.identifier);        
        sb.append(" with a ");
        sb.append("body", this.colors.identifier);
        sb.append(" type of ");
        sb.append(bodyType, this.colors.name);
        sb.append(" error: ", this.colors.identifier);
        sb.append(error, this.colors.name);

        this.log(sb.toString(), this.spawnErrorLevel);
    }

    public rclUpgrade(colonyName: string, newLevel: number): void {

    }

    public underAttack(colonyName: string): void {

    }

    public milestoneMet(colonyName: string, milestoneName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" has met the ", this.colors.importantPositiveVerb);
        sb.append("milestone ", this.colors.identifier);        
        sb.append(milestoneName, this.colors.name);        

        this.log(sb.toString(), this.milestoneMetLevel);
    }

    public creepRequestFailed(requestingColonyName: string, bodyType: string, maxRange?: number): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append(this.colony(requestingColonyName), this.colors.name);
        sb.append(" requested spawn support for a ", this.colors.neutralVerb);
        sb.append(bodyType, this.colors.name);
        if (maxRange) {
            sb.append("within range of ");
            sb.append(maxRange.toString(), this.colors.information);
        }
        sb.append(" but the Empire could not fulfill", this.colors.negativeVerb);

        this.log(sb.toString(), this.creepRequestFailedLevel);
    }
}

class OperationEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Operation");
    }

    public initLevel: number = 4;
    public startLevel: number = 5;
    public finishLevel: number = 7;
    public cancelLevel: number = 7;

    public failedInitLevel: number = 4;
    public failedStartLevel: number = 5;
    public failedFinishLevel: number = 7;

    public creepAssignedLevel: number = 2;
    public creepAssignmentFailedLevel: number = 6;

    public creepReplacementAssignedLevel: number = 2;
    public creepReplacementAssignmentFailedLevel: number = 6;

    public assignmentReleasedLevel: number = 3;
    public assignmentReleaseFailedLevel: number = 6;
    
    public finish(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("finished", this.colors.positiveVerb);

        this.log(sb.toString(), this.finishLevel);
    }

    public cancel(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("been canceled", this.colors.neutralVerb);

        this.log(sb.toString(), this.cancelLevel);
    }


    public init(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("initialized", this.colors.positiveVerb);

        this.log(sb.toString(), this.initLevel);
    }

    public initAgain(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("requested another initializion", this.colors.neutralVerb);

        this.log(sb.toString(), this.initLevel);
    }

    public initPartial(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("partially initialized", this.colors.neutralVerb);

        this.log(sb.toString(), this.initLevel);
    }

    public initFailed(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to initialize", this.colors.negativeVerb);

        this.log(sb.toString(), this.failedInitLevel);
    }


    public start(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("started", this.colors.positiveVerb);

        this.log(sb.toString(), this.startLevel);
    }

    public startAgain(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("requested to start again", this.colors.neutralVerb);

        this.log(sb.toString(), this.startLevel);
    }

    public startPartial(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("partially started", this.colors.neutralVerb);

        this.log(sb.toString(), this.startLevel);
    }

    public startFailed(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to start", this.colors.negativeVerb);

        this.log(sb.toString(), this.failedStartLevel);
    }

    public failedToFinish(operationName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" has ");
        sb.append("failed to finish", this.colors.negativeVerb);

        this.log(sb.toString(), this.failedFinishLevel);
    }



    public creepAssigned(operationName: string, creepName: string, bodyType: string): void {
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

        this.log(sb.toString(), this.creepAssignedLevel);
    }

    public creepReplacementAssigned(operationName: string, creepName: string, bodyType: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" was assigned as replacement to ", this.colors.neutralVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);

        this.log(sb.toString(), this.creepReplacementAssignedLevel);
    }

    public creepAssignmentFailed(operationName: string, creepName: string, bodyType: string, msg: string) {
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
        sb.append(" : ");
        sb.append(msg, this.colors.information);

        this.log(sb.toString(), this.creepAssignmentFailedLevel);
    }

    public creepReplacementAssignmentFailed(operationName: string, creepName: string, bodyType: string, msg: string) {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" failed to assign as a replacement to ", this.colors.negativeVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" : ");
        sb.append(msg, this.colors.information);

        this.log(sb.toString(), this.creepReplacementAssignmentFailedLevel);
    }

    public assignmentReleased(operationName: string, creepName: string, bodyType: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" was released from ", this.colors.neutralVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);

        this.log(sb.toString(), this.assignmentReleasedLevel);
    }

    public assignmentReleaseFailed(operationName: string, creepName: string, bodyType: string, msg: string) {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier);
        sb.append(creepName, this.colors.name);
        sb.append(" with ");
        sb.append("body ", this.colors.identifier);
        sb.append(bodyType, this.colors.name);
        sb.append(" failed to release from ", this.colors.negativeVerb);
        sb.append("operation ", this.colors.identifier);
        sb.append(operationName, this.colors.name);
        sb.append(" : ");
        sb.append(msg, this.colors.information);

        this.log(sb.toString(), this.assignmentReleaseFailedLevel);
    }
}

class CreepEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Creep");
    }

    public bornLevel: number = 2;
    public diedLevel: number = 2;
    
    public born(creepName: string, bodyType: string, roleName: string, colonyName: string): void {

    }

    public died(creepName: string, colonyName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Creep ", this.colors.identifier)
            .append(creepName, this.colors.name)
            .append(" died ", this.colors.neutralVerb)
            .append(" in ")
            .append("colony ", this.colors.identifier)
            .append(this.colony(colonyName), this.colors.name);

        this.log(sb.toString(), this.diedLevel);
    }    
}

class RemoteMiningEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Remote Mining");
    }

    public scoutFailedLevel: number = 8;
    public roomScoutedAndAddedLevel: number = 6;
    public roomScoutedAndDiscardedLevel: number = 6;
    public scoutJobClaimedLevel: number = 4;
    public scoutJobReleasedLevel: number = 4;

    public scoutFailed(colonyName: string, roomName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" failed to scout ", this.colors.negativeVerb);
        sb.append("room ", this.colors.identifier);
        sb.append(roomName);
        sb.append(" for ");
        sb.append("remote mining", this.colors.name);

        this.log(sb.toString(), this.scoutFailedLevel);
    }

    public roomScoutedAndAdded(colonyName: string, roomName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" scouted ", this.colors.neutralVerb);
        sb.append("and added ", this.colors.positiveVerb);
        sb.append("room ", this.colors.identifier);
        sb.append(roomName);
        sb.append(" for ");
        sb.append("remote mining", this.colors.name);

        this.log(sb.toString(), this.scoutFailedLevel);
    }

    public roomScoutedAndDiscarded(colonyName: string, roomName: string): void {
        var sb = new StringBuilder();
        sb.defaultColor = this.colors.default;

        sb.append("Colony ", this.colors.identifier);
        sb.append(this.colony(colonyName), this.colors.name);
        sb.append(" scouted and discarded ", this.colors.neutralVerb);
        sb.append("room ", this.colors.identifier);
        sb.append(roomName);
        sb.append(" for ");
        sb.append("remote mining", this.colors.name);

        this.log(sb.toString(), this.scoutFailedLevel);
    }

    public scoutJobClaimed(colonyName: string, roomName: string): void {

    }

    public scoutJobReleased(colonyName: string, roomName: string): void {

    }
}

class DebugEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "Debug");
    }

    public playbackStart(): void {
        let sb = new StringBuilder();
        sb.append("Playback started", this.colors.importantPositiveVerb);
        this.log(sb.toString(), 10);
    }

    public playbackStop(): void {
        let sb = new StringBuilder();
        sb.append("Playback stopped", this.colors.importantPositiveVerb);
        this.log(sb.toString(), 10);
    }

    public playbackPause(): void {
        let sb = new StringBuilder();
        sb.append("Playback paused", this.colors.importantPositiveVerb);
        this.log(sb.toString(), 10);
    }

    public playbackStep(): void {
        let sb = new StringBuilder();
        sb.append("Playback stepping one tick", this.colors.importantPositiveVerb);
        this.log(sb.toString(), 10);
    }

}

class SystemEvents extends EventGroup {
    constructor(colors: Colors, eventLog: EventLog) {
        super(colors, eventLog, "System");
    }

    public patchLevel: number = 10;
    
    public patch(functionName: string): void {
        let sb = new StringBuilder();
        sb.defaultColor = this.colors.default;
        sb.append("Applying patch for ", this.colors.importantPositiveVerb);
        sb.append(global.system.version.toString(), this.colors.name);
        sb.append(": ");
        sb.append(functionName, this.colors.name);
        this.log(sb.toString(), this.patchLevel);
    }
}
