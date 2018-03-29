import { Operation, OperationStatus } from "../../operation/Operation";
import { StringBuilder } from "../StringBuilder";

/** Provides methods for printing a single operation to the console. */
export class OperationReport {
    constructor(public operation: Operation) {
    }

    public printToConsole(): void {
        console.log(this.getHtml());
    }

    public getHtml(): string {
        var str = `<table style='width:100%'><tr><td>${this.getTitle(this.operation)}</td></tr><tr><td>  ${this.getSubTitle(this.operation)}</td></tr>`;
        var assignments = this.getAssignments(this.operation);
        for (var i = 0; i < assignments.length; i++)
            str += `<tr><td>    ${assignments[i]}</td></tr>`;
        str += "</table>";
        return str;
    }

    private getTitle(operation: Operation): string {
        var sb = new StringBuilder();
        sb.append("Operation ");
        sb.append(operation.type, "lightBlue");
        sb.append(" is ");
        if (operation.status == OperationStatus.New) {
            sb.append("New", "green");
        } else if (operation.status == OperationStatus.AwaitingReinit) {
            sb.append("Awaiting Reinit", "yellow");
        } else if (operation.status == OperationStatus.FailedInit) {
            sb.append("Failed Init", "red");
        } else if (operation.status == OperationStatus.Initialized) {
            sb.append("Initialized", "green");
        } else if (operation.status == OperationStatus.AwaitingRestart) {
            sb.append("Awaiting Restart", "yellow");
        } else if (operation.status == OperationStatus.FailedStart) {
            sb.append("Failed Start", "red");
        } else if (operation.status == OperationStatus.Started) {
            sb.append("Started", "green");
        } else if (operation.status == OperationStatus.Complete) {
            sb.append("Complete", "green");
        } else if (operation.status == OperationStatus.Canceled) {
            sb.append("Canceled", "yellow");
        } else if (operation.status == OperationStatus.FailedOther) {
            sb.append("Failed (other)", "red");
        }
        
        return sb.toString();
    }

    private getSubTitle(operation: Operation): string {
        var completed = operation.getFilledAssignmentCount();
        var total = operation.assignments.length;

        var sb = new StringBuilder();
        if (completed == total)
            sb.append(completed.toString(), "green");
        else
            sb.append(completed.toString(), "yellow")
        sb.append("/");
        sb.append(total.toString(), "green");
        sb.append(" assignments filled");
        return sb.toString();
    }

    private getAssignments(operation: Operation): string[] {
        var strings: string[] = [];

        for (var i = 0; i < operation.assignments.length; i++) {
            var assignment = operation.assignments[i];
            var sb = new StringBuilder();
            sb.append(assignment.controllerType);
            sb.append(" [");
            sb.append(assignment.body.type);
            sb.append("] ");
            if (assignment.creepName == "") {
                sb.append(" is ");
                sb.append("unfilled", "red");
            } else {
                sb.append(" filled by ");
                sb.append(assignment.creepName, "green");
            }
            strings.push(sb.toString());
        }

        return strings;
    }
}
