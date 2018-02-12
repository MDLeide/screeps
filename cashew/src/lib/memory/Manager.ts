export class MemoryManager {
    /**
     * WARNING: THIS WILL ERASE YOUR MEMORY. Initializes the Memory object to its initial state.
     */
    public static initialize(): void {
        Memory.containers = {};
        Memory.controllers = {};
        Memory.sources = {};
        Memory.colonies = {};
        Memory.nests = {};
        Memory.operationGroups = {};
        Memory.operations = {};
        Memory.plans = {};
        Memory.mapBlocks = {};
    }

    /**
     * Checks the Memory object and creates any child objects required for operation.
     */
    public static checkInit(): void {
        if (!Memory.containers)
            Memory.containers = {};
        if (!Memory.controllers)
            Memory.controllers = {};
        if (!Memory.sources)
            Memory.sources = {};
        if (!Memory.colonies)
            Memory.colonies = {};
        if (!Memory.nests)
            Memory.nests = {};
        if (!Memory.operationGroups)
            Memory.operationGroups = {};
        if (!Memory.operations)
            Memory.operations = {};
        if (!Memory.plans)
            Memory.plans = {};
        if (!Memory.mapBlocks)
            Memory.mapBlocks = {};
    }

}
