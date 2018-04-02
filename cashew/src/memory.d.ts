import { Execute } from "./imp/Execution";

declare global {
    interface Memory {
        visuals: VisualsMemory;
        empire: EmpireMemory;
        system: SystemMemory;
    }    
}
