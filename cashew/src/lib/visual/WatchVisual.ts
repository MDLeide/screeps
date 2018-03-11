import { ComponentVisual } from "./lib/ComponentVisual";
import { VisualText } from "./lib/VisualText";

export class WatchVisual extends ComponentVisual {
    constructor() {
        super("watch", "w");
    }

    private names: VisualText = new VisualText;
    private colons: VisualText = new VisualText;
    private values: VisualText = new VisualText;
    
    public draw(): void {
        this.names.alignRight();
        this.names.draw(this.x - .25, this.y);
        this.colons.alignCenter();
        this.colons.draw(this.x, this.y);
        this.values.alignLeft();
        this.values.draw(this.x + .25, this.y);
    }

    public watch(val: Object, name?: string): void {
        let error = new Error();
        let lines = error.stack.split(/\r?\n/);
        let caller = lines.length >= 3 ? lines[2] : "unknown";
        name = name ? name : "variable";
        this.names.appendLine(caller + "  |  " + name);

        if (_.isUndefined(val))
            this.values.appendLine("undefined");
        else if (val.toString() == "[object Object]")
            this.values.appendLine(JSON.stringify(val));
        else
            this.values.appendLine(val.toString());

        this.colons.appendLine(":");
    }

    public watchIf(condition: (boolean | (() => boolean)), val: any, name?: string): void {
        if (typeof condition !== "boolean") {
            return this.watchIf(condition(), val, name);
        }
        if (!condition)
            return;
        this.watch(val, name);
    }
}
