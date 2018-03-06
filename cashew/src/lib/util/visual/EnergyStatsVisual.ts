import { Colony } from "../../colony/Colony";
import { Ledger, LedgerPeriod } from "../../colony/ResourceManager";
import { VisualText } from "./lib/VisualText";

export class EnergyStatsVisual {
    public static draw(colony: Colony, x: number = 5, y: number = 2): void {
        this.drawLedger(colony.resourceManager.ledger, x, y, colony.nest.roomName);        
    }

    private static drawLedger(ledger: Ledger, x: number, y: number, roomName?: string): void{        
        this.drawTable(x - .05, y, roomName);
        this.drawValues(ledger.currentGeneration, x + .05, y, roomName);
        if (ledger.lastGeneration)
            this.drawValues(ledger.lastGeneration, x + 2.55, y, roomName);
    }

    private static drawTable(x: number, y: number, roomName?: string): void {
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

    private static drawValues(period: LedgerPeriod, x: number, y: number, roomName?: string): void {
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
