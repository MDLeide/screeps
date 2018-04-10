export class StringBuilder {
    private str: string = "";

    public defaultColor: string = "grey";
    public useHtmlBreak: boolean = true;

    public append(str: string | { toString(): string }, color: string = this.defaultColor): StringBuilder {
        if (!str)
            return this.append("undefined", color);
        if (typeof (str) != "string")
            return this.append(str.toString(), color);
        this.str += `<font color='${color}'>${str}</font>`;
        return this;
    }
    
    public appendLine(str?: string | {toString(): string}, color: string = this.defaultColor): StringBuilder {
        if (str)
            this.str += `<font color='${color}'>${str}</font>`;            

        if (this.useHtmlBreak)
            this.str += "</br>";
        else
            this.str += "\n";

        return this;
    }

    /** Trims any whitespace or breaks from the front and back of the string. */
    public trim(): StringBuilder {
        this.str = this.str.trim();
        while (this.str.endsWith("</br>"))
            this.str = this.str.slice(0, this.str.length - 5).trim();
        while (this.str.startsWith("</br>"))
            this.str = this.str.slice(5).trim();
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
