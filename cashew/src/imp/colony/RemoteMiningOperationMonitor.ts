import { ColonyMonitor } from "lib/colony/ColonyMonitor";
import { Colony } from "lib/colony/Colony";
import { RemoteHarvestScoutOperation } from "../operation/economic/RemoteHarvestScoutOperation";
import { ReservationOperation } from "../operation/military/ReservationOperation";
import { RemoteSource } from "lib/colony/RemoteMiningManager";
import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";

export class RemoteMiningOperationMonitor extends ColonyMonitor {
    public static fromMemory(memory: MonitorMemory): RemoteMiningOperationMonitor {
        let monitor = new this();
        return ColonyMonitor.fromMemory(memory, monitor) as RemoteMiningOperationMonitor;
    }

    constructor() {
        super(MONITOR_REMOTE_MINING_OPERATION);
    }
    
    public load(): void {
    }

    public update(context: Colony): void {
    }

    public execute(context: Colony): void {
        if (context.nest.room.controller.level >= 2) {
            for (var i = 0; i < context.remoteMiningManager.rooms.length; i++) {
                let room = context.remoteMiningManager.rooms[i];
                if (!room.beingScouted)
                    this.ensureOperation(
                        context,
                        OPERATION_REMOTE_HARVEST_SCOUT,
                        1,
                        () => new RemoteHarvestScoutOperation,
                        (op: RemoteHarvestScoutOperation) => op.targetRoom == room.name);
            }
        }       

        if (context.nest.room.controller.level >= 3) {
            for (var i = 0; i < context.remoteMiningManager.rooms.length; i++) {
                let room = context.remoteMiningManager.rooms[i];
                if (room.active)
                    this.ensureOperation(
                        context,
                        OPERATION_RESERVATION,
                        1,
                        () => new ReservationOperation(room.name),
                        (op: ReservationOperation) => op.roomName == room.name);
            }
        }

        for (var i = 0; i < context.remoteMiningManager.rooms.length; i++) {
            let room = context.remoteMiningManager.rooms[i];
            for (var j = 0; j < room.remoteSources.length; j++) {
                let source = room.remoteSources[j];
                if (source.beingMined)
                    this.ensureOperation(
                        context,
                        OPERATION_REMOTE_HARVEST,
                        1,
                        () => new RemoteHarvestOperation(source.sourceId, room.name),
                        (op: RemoteHarvestOperation) => op.sourceId == source.sourceId);
            }
        }

        let remoteSource = context.remoteMiningManager.getNextMiningAssignment();
        while (remoteSource) {
            this.ensureOperation(
                context,
                OPERATION_REMOTE_HARVEST,
                1,
                () => new RemoteHarvestOperation(remoteSource.source.sourceId, remoteSource.room.name),
                (op: RemoteHarvestOperation) => op.sourceId == remoteSource.source.sourceId);
            remoteSource.source.beingMined = true;
            remoteSource = context.remoteMiningManager.getNextMiningAssignment();
        }
    }

    public cleanup(context: Colony): void {
    }
}
