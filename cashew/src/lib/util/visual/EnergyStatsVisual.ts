import { Colony } from "../../colony/Colony";
import { Ledger, LedgerPeriod } from "../../colony/ResourceManager";
import { VisualText } from "./lib/VisualText";

export class EnergyStatsVisual {
    public static draw(colony: Colony): void {
        this.drawLedger(colony.resourceManager.ledger, 6.5, 2, colony.nest.roomName);        
    }

    private static drawLedger(ledger: Ledger, x: number, y: number, roomName?: string): void{
        this.drawPeriod(ledger.lastTick, "Last Tick", x, y, roomName);
        this.drawPeriod(ledger.currentGeneration, "Current Generation", x + 9, y, roomName);
        this.drawPeriod(ledger.lastGeneration, "Last Generation", x + 18, y, roomName);
    }

    private static drawPeriod(period: LedgerPeriod, header: string, x: number, y: number, roomName?: string): void {
        let roomVisual = new RoomVisual(roomName);
        roomVisual.text(header, x, y);
        roomVisual.text(period.ticks + " @ " + period.startTick, x, y + 1);

        let visual = new VisualText();
        visual.alignRight();
                
        visual.appendLine("Revenue");
        visual.appendLine("Harvest: ");
        visual.appendLine("Remote Harvest: ");
        visual.appendLine("Empire Incoming: ");
        visual.appendLine("Market Buy: ");
        visual.appendLine();
        visual.appendLine("Expenses");
        visual.appendLine("Spawn: ");
        visual.appendLine("Upgrade: ");
        visual.appendLine("Build: ");
        visual.appendLine("Repair: ");
        visual.appendLine("Empire Outgoing: ");
        visual.appendLine("Market Sell: ");
        visual.appendLine("Terminal Transfer: ");
        visual.appendLine("Link Transfer: ");
        visual.appendLine();
        visual.appendLine("Net: ");

        visual.draw(x - .1, y + 2, roomName);

        let rightVisual = new VisualText();
        rightVisual.alignLeft();
                
        rightVisual.appendLine();
        rightVisual.appendLine(period.harvestEnergy);
        rightVisual.appendLine(period.remoteHarvestEnergy);
        rightVisual.appendLine(period.empireIncomingEnergy);
        rightVisual.appendLine(period.marketBuyEnergy);
        rightVisual.appendLine();
        rightVisual.appendLine();
        rightVisual.appendLine(period.spawnEnergy);
        rightVisual.appendLine(period.upgradeEnergy);
        rightVisual.appendLine(period.buildEnergy);
        rightVisual.appendLine(period.repairEnergy);
        rightVisual.appendLine(period.empireOutgoingEnergy);
        rightVisual.appendLine(period.marketSellEnergy);
        rightVisual.appendLine(period.terminalTransferEnergy);
        rightVisual.appendLine(period.linkTransferEnergy);
        rightVisual.appendLine();
        rightVisual.appendLine(period.netEnergy);

        rightVisual.draw(x + .1, y + 2, roomName);
    }
}
