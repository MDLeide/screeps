export class MemoryManager {
    /**
     * WARNING: THIS WILL ERASE YOUR MEMORY. Initializes the Memory object to its initial state.
     */
    public static initialize(): void {
        Memory.empire = {
            colonies: {}
        };
    }

    /**
     * Checks the Memory object and creates any child objects required for operation.
     */
    public static checkInit(): void {
        if (!Memory.empire)
            Memory.empire = {
                colonies: {}
            };
        if (!Memory.visuals)
            Memory.visuals = {
                drawNestMapSpecials: false,
                drawNestMapStructures: false,
                drawColonyEnergyStats: true
            }
    }

}
