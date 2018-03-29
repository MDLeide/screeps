import { ComponentVisual } from "./lib/ComponentVisual";
import { Colony } from "../colony/Colony";
import { Ledger, LedgerPeriod } from "../colony/ResourceManager";
import { VisualText } from "./lib/VisualText";

export class EnergyVisual extends ComponentVisual {
    constructor() {
        super("energy", "e");
    }

    public draw(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            this.drawLedger(colony.resourceManager.ledger, this.x, this.y, colony.nest.roomName);
        }
    }

    private drawLedger(ledger: Ledger, x: number, y: number, roomName?: string): void {
        this.drawTable(x - .05, y, roomName);

        this.drawValues(ledger.currentGeneration, x + .05, y, roomName);

        if (ledger.lastGeneration)
            this.drawValues(ledger.lastGeneration, x + 2.55, y, roomName);
    }

    private drawTable(x: number, y: number, roomName?: string): void {
        let visual = new VisualText();
        visual.alignRight();

        visual.appendLine("Harvest: ");
        visual.appendLine("R. Harvest: ");
        visual.appendLine("Emp. In: ");
        visual.append("Market Buy: ");

        visual.draw(x, y, roomName);
        let height = visual.getHeight();
        visual = new VisualText();
        visual.alignRight();

        visual.appendLine("Spawn: ");
        visual.appendLine("Upgrade: ");
        visual.appendLine("Build: ");
        visual.appendLine("Repair: ");
        visual.appendLine("Emp. Out: ");
        visual.appendLine("Market Out: ");
        visual.appendLine("Terminal: ");
        visual.appendLine("Link: ");
        visual.append("Tower: ");


        visual.draw(x, y + height + .25, roomName);
        height += visual.getHeight() + .25;
        visual = new VisualText();
        visual.alignRight();

        visual.appendLine("Revenue: ");
        visual.appendLine("Expense: ");
        visual.append("Net: ");
        visual.draw(x, y + height + .25, roomName);
    }

    private drawValues(period: LedgerPeriod, x: number, y: number, roomName?: string): void {
        let visual = new VisualText();

        visual.appendLine(period.harvestEnergy);
        visual.appendLine(period.remoteHarvestEnergy);
        visual.appendLine(period.empireIncomingEnergy);
        visual.append(period.marketBuyEnergy);

        visual.draw(x, y, roomName);
        let height = visual.getHeight();
        visual = new VisualText();

        visual.appendLine(period.spawnEnergy);
        visual.appendLine(period.upgradeEnergy);
        visual.appendLine(period.buildEnergy);
        visual.appendLine(period.repairEnergy);
        visual.appendLine(period.empireOutgoingEnergy);
        visual.appendLine(period.marketSellEnergy);
        visual.appendLine(period.terminalTransferEnergy);
        visual.appendLine(period.linkTransferEnergy);
        visual.append(period.towerEnergy);

        visual.draw(x, y + height + .25, roomName);
        height += visual.getHeight() + .25;
        visual = new VisualText();

        visual.appendLine(period.totalRevenue);
        visual.appendLine(period.totalExpenses);
        visual.append(period.netEnergy);

        visual.draw(x, y + height + .25, roomName);
    }
}
