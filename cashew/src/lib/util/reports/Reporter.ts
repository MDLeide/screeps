import { Empire } from "../../empire/Empire";
import { Colony } from "../../colony/Colony";

import { OperationReport } from "./OperationReport";
import { Operation } from "../../operation/Operation";
import { StringBuilder } from "../StringBuilder";

export class Reporter {
    constructor(public empire: Empire) { }

    public help(): string {
        let help = "allOperations() [ops] </br>";
        help += "colonyOperations(colonyName)</br>";
        return help;
    }

    public ops(): string { return this.allOperations(); }
    public allOperations(): string {
        var html = "";
        for (var i = 0; i < this.empire.colonies.length; i++) {
            html += this.colonyOperations(this.empire.colonies[i].name);
            if (i != this.empire.colonies.length - 1)
                html += "</br></br>";
        }
        return html;
    }

    public colonyOperations(colony: (string | Colony)): string {
        if (!(colony instanceof Colony)) {
            return this.colonyOperations(this.empire.getColonyByName(colony))
        }
        if (!colony)
            return "";

        let sb = new StringBuilder();
        sb.append(this.printOperations(colony.operations.runners.map(p => p.operation)));
        return sb.getString();
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
