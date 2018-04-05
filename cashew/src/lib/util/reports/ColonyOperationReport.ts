import { Colony } from "../../colony/Colony";
import { StringBuilder } from "../StringBuilder";
import { OperationReport } from "./OperationReport";

export class ColonyOperationReport {
    constructor(colony: Colony) {
        this.colony = colony;
    }

    public colony: Colony;

    public getHtml(): string {
        let sb = new StringBuilder();
        sb.append("== ");
        sb.append(this.colony.name, "yellow");
        sb.append(" Operations");
        sb.appendLine(` [${this.colony.operations.runners.length}] ==`);
        sb.appendLine();
        for (var i = 0; i < this.colony.operations.runners.length; i++) {
            let report = new OperationReport(this.colony.operations.runners[i].operation);
            sb.append(report.getHtml());
            if (i < this.colony.operations.runners.length - 1)
                sb.appendLine();
        }
        return sb.toString();
    }
}
