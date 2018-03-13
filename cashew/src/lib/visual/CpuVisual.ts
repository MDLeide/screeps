import { ComponentVisual } from "./lib/ComponentVisual";
import { VisualText } from "./lib/VisualText";

export class CpuVisual extends ComponentVisual {
    constructor() {
        super("cpu");
    }

    public draw(): void {
        let labels = new VisualText();
        let values = new VisualText();

        labels.appendLine("Bucket:");
        labels.appendLine("Used:");
        labels.append("Tick Limit:");

        labels.alignRight();

        values.appendLine(Game.cpu.bucket);
        let used = Game.cpu.getUsed();
        values.appendLine(used);
        values.append(Game.cpu.tickLimit);

        values.alignLeft();

        labels.draw(this.x, this.y);
        values.draw(this.x, this.y);
    }
}
