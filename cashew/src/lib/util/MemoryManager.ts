import { SystemSettings } from "imp/Execution";

export class MemoryManager {
    /**
     * WARNING: THIS WILL ERASE YOUR MEMORY. Reverts the Memory object to its initial state.
     */
    public static initialize(): void {
        Memory.system = this.getSystemMemory();
        Memory.empire = this.getEmpireMemory();
        Memory.visuals = this.getVisualMemory();
    }

    /**
     * Checks the Memory object and creates any child objects required for operation.
     */
    public static checkInit(): void {
        Memory.system = this.validateSystemMemory(Memory.system);
        Memory.empire = this.validateEmpireMemory(Memory.empire);
        Memory.visuals = this.validateVisualMemory(Memory.visuals);
    }


    private static validateSystemMemory(memory: SystemMemory): SystemMemory {
        if (!memory) memory = this.getSystemMemory();        
        return memory;
    }

    private static validateEmpireMemory(memory: EmpireMemory): EmpireMemory {
        if (!memory) return this.getEmpireMemory();

        if (!memory.colonies) memory.colonies = {};
        if (!memory.exchange) memory.exchange = this.getExchangeMemory();
        if (!memory.monitorManager) memory.monitorManager = this.getEmpireMonitorManagerMemory();
        if (!memory.map) memory.map = { rooms: {} };

        return memory;
    }

    private static validateVisualMemory(memory: VisualsMemory): VisualsMemory {
        return memory ? memory : this.getVisualMemory();
    }


    private static getSystemMemory(): SystemMemory {
        return {
            major: SystemSettings.major,
            minor: SystemSettings.minor,
            patch: 0,
            lastUpdate: new Date().valueOf(),
            debug: SystemSettings.forceDebugValue,
            name: SystemSettings.systemName,
            resetHistory: [],
            codeChangeHistory: []
        };
    }

    private static getEmpireMemory(): EmpireMemory {
        return {
            colonies: {},
            exchange: this.getExchangeMemory(),
            monitorManager: this.getEmpireMonitorManagerMemory(),
            map: { rooms: {}}
        };
    }

    private static getVisualMemory(): VisualsMemory {
        return {};
    }

    private static getExchangeMemory(): ExchangeMemory {
        return {
            demandOrders: {},
            supplyOrders: {},
            transactions: {}
        };
    }

    private static getEmpireMonitorManagerMemory(): MonitorManagerMemory {
        return {
            monitors: [],
            provider: MONITOR_PROVIDER_EMPIRE_STANDARD
        };
    }
}
