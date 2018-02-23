import { Execute } from "./imp/Execution";

declare global {
    interface Memory {
        containers: { [containerId: string]: ContainerMemory };
        controllers: { [controllerId: string]: ControllerMemory };
        sources: { [sourceId: string]: SourceMemory };

        visuals: VisualsMemory;
        empire: EmpireMemory;
    }
}
