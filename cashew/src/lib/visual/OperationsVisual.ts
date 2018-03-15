import { ComponentVisual } from "./lib/ComponentVisual";
import { Colony } from "../colony/Colony";
import { Operation, OperationStatus } from "../operation/Operation";
import { VisualText } from "./lib/VisualText";

export class OperationsVisual extends ComponentVisual {
    constructor(colony: Colony) {
        super("operations", "ops");
        this.colony = colony;
    }

    public colony: Colony;
    public displayCreepRoster: boolean = true;
    public operationSpacing: number = .2;
    public planSpacing: number = .35;

    public draw(): void {
        let offset = 0;
        for (var i = 0; i < this.colony.operationPlans.length; i++) {
            let plan = this.colony.operationPlans[i];

            for (var j = 0; j < plan.operationGroup.runners.length; j++) {
                let op = plan.operationGroup.runners[j].operation;
                offset += this.drawOperation(op, this.x, this.y + offset, this.colony.nest.roomName);
                offset += this.operationSpacing;
            }
            offset += this.planSpacing;
        }
    }

    /** Returns the height of the draw. */
    private drawOperation(op: Operation, x: number, y: number, roomName: string): number {
        let vt = new VisualText();        
        vt.append(`Operation ${op.type} is`);
        let opStatus = this.getOpStatus(op.status);
        vt.appendLine(opStatus.status, opStatus.color);
        vt.appendLine(`${op.getFilledAssignmentCount()}/${op.assignments.length} assignments filled`);
        let lineCount = 2
        if (this.displayCreepRoster) {
            for (var i = 0; i < op.assignments.length; i++) {
                let assignment = op.assignments[i];
                if (op.assignments.length == i - 1)
                    vt.append(`${assignment.controllerType} filled by ${assignment.creepName}`);
                else
                    vt.appendLine(`${assignment.controllerType} filled by ${assignment.creepName}`);
                lineCount++;
            }
        }
        vt.draw(x, y, roomName);
        return vt.lineSpacing + lineCount;
    }

    private getOpStatus(status: OperationStatus): { status: string, color: string} {
        switch (status) {
            case OperationStatus.New:
                return { status: "New", color: "grey" };
            case OperationStatus.AwaitingReinit:
                return { status: "Awaiting Reinit", color: "yellow" };
            case OperationStatus.Initialized:
                return { status: "Initialized", color: "orange" };
            case OperationStatus.AwaitingRestart:
                return { status: "Awaiting Restart", color: "yellow" };
            case OperationStatus.Started:
                return { status: "Started", color: "green" };
            case OperationStatus.Complete:
                return { status: "Complete", color: "blue" };
            case OperationStatus.Canceled:
                return { status: "Canceled", color: "red" };
            case OperationStatus.FailedInit:
                return { status: "Failed Reinit", color: "red" };
            case OperationStatus.FailedStart:
                return { status: "Failed Start", color: "red" };;
            case OperationStatus.FailedOther:
                return { status: "Failed Other", color: "red" };;
            default:
                return { status: "Unknown", color: "red" };
        }
    }
}
