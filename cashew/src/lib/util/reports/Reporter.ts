import { Empire } from "../../empire/Empire";
import { Colony } from "../../colony/Colony";

import { OperationReport } from "./OperationReport";
import { Operation } from "../../operation/Operation";
import { StringBuilder } from "../StringBuilder";
import { ColonyOperationReport } from "./ColonyOperationReport";

export class Reporter {
    constructor() { }

    public help(): string {
        let help = "allOperations() [ops] </br>";
        help += "colonyOperations(colonyName)</br>";
        return help;
    }

    public ops(): string { return this.allOperations(); }

    public allOperations(): string {
        let empire = global.empire;
        let sb = new StringBuilder();
        for (var i = 0; i < empire.colonies.length; i++) {
            let report = new ColonyOperationReport(empire.colonies[i]);
            sb.append(report.getHtml());
            if (i < empire.colonies.length - 1)
                sb.appendLine();
        }
        return sb.toString();
    }

    public colonyOperations(colony: (string | Colony)): string {
        if (!(colony instanceof Colony))
            return this.colonyOperations(global.empire.getColonyByName(colony))        
        if (!colony)
            return "Report Error: No Colony Provided";

        let report = new ColonyOperationReport(colony);
        return report.getHtml();
    }
}
