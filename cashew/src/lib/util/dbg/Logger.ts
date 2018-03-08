export class Logger {

    public color: string = "white";

    log(msg: string)
    public log(msg: string, color?: string)
    public log(msg: string, color?: string, category?: string)
    public log(msg: string, color: string = this.color, category: string = "") {
        console.log(`<span style='color:${color}'>${category}: ${msg}</span>`);
    }
}
