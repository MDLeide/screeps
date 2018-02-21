import { Operation } from "../operation/Operation";
import { StringBuilder } from "../util/StringBuilder";

export class OperationReport {
    constructor(public operation: Operation) {
    }

    public printToConsole(): void {
        console.log(this.getHtml());
    }

    public getHtml(): string {
        var str = `<table style='width:100%'> <tr> <td>${this.getTitle(this.operation)}</td> </tr> <tr> <td>${this.getSubTitle(this.operation)}</td> </tr>`;
        var assignments = this.getAssignments(this.operation);
        for (var i = 0; i < assignments.length; i++)
            str += `<tr><td>${assignments[i]}</td></tr>`;
        str += "</table>";
        return str;
    }

    private getTitle(operation: Operation): string {
        var sb = new StringBuilder();
        sb.append("Operation ");
        sb.append(operation.name, "lightBlue");
        sb.append(" is ");
        if (operation.finished)
            sb.append("Finished", "orange");
        else if (operation.started)
            sb.append("Started", "green");
        else if (operation.initialized)
            sb.append("Initialized", "yellow");
        else
            sb.append(" New ", "red");
        
        return sb.getString();
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
        return sb.getString();
    }

    private getAssignments(operation: Operation): string[] {
        var strings: string[] = [];

        for (var i = 0; i < operation.assignments.length; i++) {
            var assignment = operation.assignments[i];
            var sb = new StringBuilder();
            sb.append(assignment.roleId);
            sb.append(" [");
            sb.append(assignment.body.name);
            sb.append("] ");
            if (assignment.creepName == "") {
                sb.append(" is ");
                sb.append("unfilled", "red");
            } else {
                sb.append(" filled by ");
                sb.append(assignment.creepName, "green");
            }
            strings.push(sb.getString());
        }

        return strings;
    }
}
