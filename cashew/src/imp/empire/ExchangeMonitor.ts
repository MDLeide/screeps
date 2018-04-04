import { EmpireMonitor } from "lib/empire/EmpireMonitor";
import { Empire } from "lib/empire/Empire";

export class ExchangeMonitor extends EmpireMonitor {
    public static fromMemory(memory: EmpireMonitorMemory): ExchangeMonitor {
        let monitor = new this();
        return EmpireMonitor.fromMemory(memory, monitor) as ExchangeMonitor;
    }

    constructor() {
        super(MONITOR_EXCHANGE);
    }

    public load(): void {
    }

    public update(context: Empire): void {
    }

    public execute(context: Empire): void {
    }

    public cleanup(context: Empire): void {
    }
}
