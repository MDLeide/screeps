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

    public toString(): string {
        return this.str;
    }
}
