export class VisualText {
    private lines: string[] = [];
    private current: string = "";
    private alignment: "left" | "center" | "right" = "left";
    private header: string;

    public headerSpacing: number = 1.5;    
    public lineSpacing: number = .85;
    public color: string = "#FFFFFF";
    public dropShadow: boolean = true;
    public dropShadowColor: string = "#000000";


    public alignLeft(): void { this.alignment = "left"; }
    public alignCenter(): void { this.alignment = "center"; }
    public alignRight(): void { this.alignment = "right"; }

    public getHeight(): number {
        return this.lines.length * this.lineSpacing + this.lineSpacing;
    }

    public setHeader(str: string): void {
        this.header = str;
    }

    public clearHeader(): void {
        this.header = undefined;
    }

    public append(str: any): void {
        if (str)
            this.current += str.toString();
    }

    public appendLine(str?: any): void {
        if (str)
            this.current += str.toString();
        this.lines.push(this.current);
        this.current = "";
    }

    public draw(x: number, y: number, roomName?: string): void {
        let visual = new RoomVisual(roomName);

        if (this.dropShadow) {
            let dropStyle = {
                align: this.alignment,
                color: this.dropShadowColor,
                strokeWidth: .5
            };
            this.doDraw(x + .075, y + .075, visual, dropStyle);
        }

        let style = {
            align: this.alignment,
            color: this.color,
            //stroke: "#000000"
        };
        
        this.doDraw(x, y, visual, style);
    }

    private doDraw(x: number, y: number, visual: RoomVisual, style: TextStyle): void {        
        let offset = 0;
        if (this.header) {
            visual.text(this.header, x, y, style);
            offset += this.headerSpacing;
        }

        for (var i = 0; i < this.lines.length; i++) {
            visual.text(this.lines[i], x, y + offset, style);
            offset += this.lineSpacing;
        }
        visual.text(this.current, x, y + offset, style);
    }
}
