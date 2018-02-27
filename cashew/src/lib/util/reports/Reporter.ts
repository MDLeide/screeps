import { Empire } from "../../empire/Empire";
import { OperationReport } from "./OperationReport";
import { Operation } from "../../operation/Operation";

export class Reporter {
    constructor(public empire: Empire) { }

    public help(): string {
        let help = "allOperations()</br>";
        help += "colonyOperations(colonyName)</br>";
        return help;
    }

    public allOperations(): string {
        var html = "";
        for (var i = 0; i < this.empire.colonies.length; i++) {
            html += this.colonyOperations(this.empire.colonies[i].name);
            if (i != this.empire.colonies.length)
                html += "</br></br>";
        }
        return html;
    }

    public colonyOperations(colonyName: string): string {
        for (var i = 0; i < this.empire.colonies.length; i++) {
            var colony = this.empire.colonies[i];
            if (colony.name == colonyName) {
                var html = "";
                for (var i = 0; i < colony.operationPlans.length; i++) {
                    html += this.printOperations(colony.operationPlans[i].operationGroup.operations);
                }
                return html;
            }
        }
        return "";
    }

    private printOperations(operations: Operation[]): string {
        var html = "";
        for (var i = 0; i < operations.length; i++) {
            var report = new OperationReport(operations[i]);
            html += report.getHtml();

            if (i != operations.length - 1)
                html += "</br>";
        }
        return html;
    }
}
