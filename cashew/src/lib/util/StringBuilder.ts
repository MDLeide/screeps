export class StringBuilder {
    private str: string = "";

    public defaultColor: string = "grey";

    public append(str: string, color: string = this.defaultColor): StringBuilder {
        this.str += `<font color='${color}'>${str}</font>`;
        return this;
    }
    
    public appendLine(str: string, color: string = this.defaultColor): StringBuilder {
        this.str += `<font color='${color}'>${str}</font></br>`;
        return this;
    }

    public getString(): string {
        return this.str;
    }
}
