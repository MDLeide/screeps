export class StringBuilder {
    private str: string = "";

    public defaultColor: string = "grey";

    public append(str: string, color: string = this.defaultColor): void {
        this.str += `<span style='color:${color}'>${str}</span>`;
    }
    
    public appendLine(str: string, color: string = this.defaultColor): void {
        this.str += `<span style='color:${color}'>${str}</span></br>`;
    }

    public getString(): string {
        return this.str;
    }
}
