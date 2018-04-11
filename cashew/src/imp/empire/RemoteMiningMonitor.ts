import { EmpireMonitor } from "lib/empire/EmpireMonitor";
import { Empire } from "lib/empire/Empire";
import { RemoteMiningPlanner } from "lib/empire/RemoteMiningPlanner";
import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";
import { ReservationOperation } from "../operation/military/ReservationOperation";
import { MapScouter } from "lib/empire/WorldMap";

export class RemoteMiningMonitor extends EmpireMonitor {
    public static fromMemory(memory: MonitorMemory): RemoteMiningMonitor {
        let monitor = new this();
        return EmpireMonitor.fromMemory(memory, monitor) as RemoteMiningMonitor;
    }

    constructor() {
        super(MONITOR_REMOTE_MINING);
    }

    public load(): void {
    }

    public update(context: Empire): void {
        this.sleep(30000);
        MapScouter.scout();
        RemoteMiningPlanner.updateMiningAssignments(3);
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let c = global.empire.colonies[i];

            c.operations.cancelOperationByType(c, OPERATION_RESERVATION);

            // create ops for new mining assignments
            let assignments = RemoteMiningPlanner.getAssignmentsForColony(c);
            for (var j = 0; j < assignments.length; j++) {
                for (var k = 0; k < assignments[j].sources.length; k++) {
                    this.ensureOperation(
                        c,
                        OPERATION_REMOTE_HARVEST,
                        1,
                        () => new RemoteHarvestOperation(assignments[j].sources[k].id, assignments[j].name),
                        (op: RemoteHarvestOperation) => op.roomName == assignments[j].name && op.sourceId == assignments[j].sources[k].id);
                }

                if (c.getEffectiveRcl().isGreaterThanOrEqualTo(3, 2))
                    this.ensureOperation(
                        c,
                        OPERATION_RESERVATION,
                        1,
                        () => new ReservationOperation(assignments[j].name),
                        (op: ReservationOperation) => op.roomName == assignments[j].name);
            }

            // cancel mining operations for rooms this colony no longer owns
            for (var i = 0; i < c.operations.runners.length; i++) {
                if (c.operations.runners[i].operation.type != OPERATION_REMOTE_HARVEST)
                    continue;
                let op = c.operations.runners[i].operation as RemoteHarvestOperation;
                
                let cancel = true;
                for (var j = 0; j < assignments.length; j++) {
                    if (assignments[j].miningInfo.owner != c.name)
                        continue;

                    for (var k = 0; k < assignments[j].sources.length; k++) {
                        if (op.roomName == assignments[j].name && op.sourceId == assignments[j].sources[k].id) {
                            cancel = false;
                            break;
                        }
                    }

                    if (!cancel)
                        break;
                }
                if (cancel)
                    op.cancel(c);
            }
        }
    }

    public execute(context: Empire): void {
    }

    public cleanup(context: Empire): void {
    }
}
