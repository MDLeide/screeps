export class VisualText {
    private lines: Line[] = [];
    private current: Line;
    private alignment: "left" | "center" | "right" = "left";


    constructor() {
        this.current = new Line();
    }

    
    public lineSpacing: number = .85;
    public defaultColor: string = "#FFFFFF";
    public dropShadow: boolean = true;
    public dropShadowColor: string = "#000000";
    public size: number = 0.7;
    
    public alignLeft(): void { this.alignment = "left"; }

    public alignCenter(): void { this.alignment = "center"; }

    public alignRight(): void { this.alignment = "right"; }
    
    public getHeight(): number {
        return this.lines.length * this.lineSpacing + this.lineSpacing;
    }


    public append(str: any, color?: string): void {
        this.current.append(str, color);
    }

    public appendLine(str?: any, color?: string): void {
        if(str)
            this.current.append(str, color);
        
        this.lines.push(this.current);
        this.current = new Line();
    }


    public draw(x: number, y: number, roomName?: string): void {
        let visual = new RoomVisual(roomName);

        if (this.dropShadow) {
            let dropStyle = this.getDropShadowStyle();
            this.doDraw(x + .075, y + .075, visual, dropStyle, true);
        }

        let style = this.getNormalStyle();
        
        this.doDraw(x, y, visual, style, false);
    }


    private getDropShadowStyle(): TextStyle {
        return {
            align: this.alignment,
            color: this.dropShadowColor,
            strokeWidth: .5,
            font: this.size + " courier"
        };
    }

    private getNormalStyle(): TextStyle {
        return {
            align: this.alignment,
            color: this.defaultColor,
            font: this.size + " courier"
        };
    }

    private doDraw(x: number, y: number, visual: RoomVisual, style: TextStyle, dropShadow: boolean): void {        
        let offset = 0;

        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(x, y + offset, visual, style, this.alignment, dropShadow);
            offset += this.lineSpacing;
        }

        this.current.draw(x, y + offset, visual, style, this.alignment, dropShadow);
    }
}

class Line {
    private width: number = 0;

    public get lineWidth(): number { return this.width;}
    public defaultColor: string = "#FFFFFF";
    public text: string[] = [];
    public colors: string[] = [];
    public fontWidth: number = .435;
    
    public append(str: any, color?: string) {
        if (str) {
            let s: string = str.toString();
            this.width += s.length * this.fontWidth;
            this.text.push(s);
        } else if (_.isUndefined(str)) {
            this.text.push("undefined");
            this.width += 9;
        } else if (str == false) {
            this.text.push("false");
            this.width += 5;
        }

        if (color)
            this.colors.push(color);
        else
            this.colors.push(this.defaultColor);
    }

    public draw(x: number, y: number, visual: RoomVisual, style: TextStyle, alignment: "left" | "center" | "right", dropShadow: boolean): void {
        style.align = "left";

        if (alignment == "left") {
            let xOffset = 0;
            for (var i = 0; i < this.text.length; i++) {
                if (!dropShadow)
                    style.color = this.colors[i];
                visual.text(this.text[i], x + xOffset, y, style);
                xOffset += this.text[i].length * this.fontWidth;
            }
        } else if (alignment == "right") {
            let offset = -this.width;
            for (var i = 0; i < this.text.length; i++) {                
                if (!dropShadow)
                    style.color = this.colors[i];
                visual.text(this.text[i], x + offset, y, style);
                offset += this.text[i].length * this.fontWidth;
            }
        } else if (alignment == "center") {
            let offset = -this.width / 2;
            
            for (var i = 0; i < this.text.length; i++) {
                if (!dropShadow)
                    style.color = this.colors[i];
                visual.text(this.text[i], x + offset, y, style);
                offset += this.text[i].length * this.fontWidth;
            }
        }
        
    }
}
