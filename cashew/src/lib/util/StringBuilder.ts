export class StringBuilder {
    private str: string = "";

    public defaultColor: string = "grey";
    public useHtmlBreak: boolean = true;

    public append(str: string, color: string = this.defaultColor): StringBuilder {
        this.str += `<font color='${color}'>${str}</font>`;
        return this;
    }
    
    public appendLine(str?: string, color: string = this.defaultColor): StringBuilder {
        if (str)
            this.str += `<font color='${color}'>${str}</font>`;

        if (this.useHtmlBreak)
            this.str += "</br>";
        else
            this.str += "\n";

        return this;
    }

    /** Trims or pads the current line to the desired length. */
    public trimOrPad(length: number, padChar?: string): StringBuilder {
        if (this.str.length < length) {
            let count = Math.floor((length - this.str.length) / padChar.length);
            for (var i = 0; i < count; i++)
                this.str += padChar;
            count = length - this.str.length;
            for (var i = 0; i < count; i++)
                this.str += padChar[i];
        } else if (this.str.length > length) {
            this.str = this.str.slice(0, length);
        }

        return this;
    }

    public clear(): void {
        this.str = "";
    }

    public toString(): string {
        return this.str;
    }
}
