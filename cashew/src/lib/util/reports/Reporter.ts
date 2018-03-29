import { Empire } from "../../empire/Empire";
import { Colony } from "../../colony/Colony";

import { OperationReport } from "./OperationReport";
import { Operation } from "../../operation/Operation";
import { StringBuilder } from "../StringBuilder";
import { ColonyOperationReport } from "./ColonyOperationReport";

export class Reporter {
    constructor(public empire: Empire) { }

    public help(): string {
        let help = "allOperations() [ops] </br>";
        help += "colonyOperations(colonyName)</br>";
        return help;
    }

    public ops(): string { return this.allOperations(); }
    public allOperations(): string {
        let sb = new StringBuilder();
        for (var i = 0; i < this.empire.colonies.length; i++) {
            let report = new ColonyOperationReport(this.empire.colonies[i]);
            sb.append(report.getHtml());
            if (i < this.empire.colonies.length - 1)
                sb.appendLine();
        }
        return sb.toString();
    }

    public colonyOperations(colony: (string | Colony)): string {
        if (!(colony instanceof Colony))
            return this.colonyOperations(this.empire.getColonyByName(colony))        
        if (!colony)
            return "Report Error: No Colony Provided";

        let report = new ColonyOperationReport(colony);
        return report.getHtml();
    }
}
