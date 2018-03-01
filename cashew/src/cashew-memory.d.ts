import { Execute } from "./imp/Execution"; // silly hack that i don't understand - this isn't actually used

declare global {
    /** FLAGS */

    interface ColonyFlagMemory {
        name: string;
        plan: PlanType;
    }

    interface PlaybackFlagMemory {
        pauseOnException: boolean;

        doOutput: boolean;
        outputColor: string;

        playbackState: string;
        lastPlaybackState: string;
    }

    /** END FLAGS */


    /** MANAGEMENT UNITS **/

    interface EmpireMemory {
        colonies: { [colonyName: string]: ColonyMemory };
    }

    interface ColonyMemory {        
        name: string;
        nest: NestMemory;
        progress: ColonyProgressMemory;
        resourceManager: ResourceManagerMemory;
        operationPlans: OperationPlanMemory[];
        remoteMiningManager: RemoteMiningManagerMemory;
    }

    interface ResourceManagerMemory {
        sourceContainerIds: string[];
        controllerContainerId: string;
        transferPriority: number[];
    }

    interface ColonyPlanMemory {
        type: PlanType;
        description: string;
        milestoneIndex: number;
        operationGroup: OperationGroupMemory;
    }

    interface ColonyProgressMemory {
        type: ProgressType;
        milestoneIndex: number;
    }

    interface OperationPlanMemory {
        type: PlanType;
        operationGroup: OperationGroupMemory;
    }

    interface NestMemory {
        roomName: string;
        map: NestMapMemory;
    }

    interface RemoteMiningManagerMemory {
        rooms: RemoteRoomMemory[];
    }

    interface RemoteRoomMemory {
        name: string;
        scouted: boolean;
        beingScouted: boolean;
        remoteSources: RemoteSourceMemory[];
    }

    interface RemoteSourceMemory {
        sourceId: string;
        containerId: string;        
        beingMined: boolean;
        profit: number;
    }
    
    /**  END MANAGEMENT UNITS **/


    /** OPERATIONS **/

    interface OperationMemory {
        type: OperationType;
        initialized: boolean;
        started: boolean;
        finished: boolean;
        assignments: AssignmentMemory[];        
    }

    interface ControllerOperationMemory extends OperationMemory {
        controllers: { [creepName: string]: CreepControllerMemory };
    }

    interface JobOperationMemory extends OperationMemory {
        jobs: { [creepName: string]: JobMemory };
    }

    interface OperationGroupMemory {
        operations: OperationMemory[];
    }

    interface AssignmentMemory {
        creepName: string;
        body: BodyMemory;
        controllerType: ControllerType;
    }

    /** END OPERATIONS **/


    /** MAPS **/

    interface MapMemory {        
        terrain: LayerMemory<Terrain>;
        roads: LayerMemory<boolean>;
        structures: LayerMemory<StructureConstant>;
        ramparts: LayerMemory<boolean>;
        special: LayerMemory<number>;
    }

    interface MapBlockMemory {        
        height: number;
        width: number;
        offset: { x: number, y: number };
        roads: LayerMemory<boolean>;
        structures: LayerMemory<StructureConstant>;
        ramparts: LayerMemory<boolean>;
        special: LayerMemory<number>;
    }

    interface LayerMemory<T> {
        defaultValue: T;
        height: number;
        width: number;
        array: any[][];
    }

    interface NestMapMemory {
        map: MapMemory;
        harvestBlocks: MapBlockMemory[];
        extensionBlock: MapBlockMemory;
        mainBlock: MapBlockMemory;
        controllerBlock: MapBlockMemory;
        labBlock: MapBlockMemory;
    }
    
    /** END MAPS **/

    /** CREEP CONTROLLERS **/

    interface CreepControllerMemory {
        type: ControllerType;
    }

    interface RoleMemory extends CreepControllerMemory {
        lastTask: TaskMemory;
        currentTask: TaskMemory;
    }

    interface JobMemory extends RoleMemory {
        complete: boolean;
    }

    interface TaskMemory {
        type: TaskType;
        complete: boolean;
        incomplete: boolean;
        error: boolean;
        finished: boolean;
    }

    interface TargetedTaskMemory extends TaskMemory {
        targetId: string;
    }

    /** END CREEP CONTROLLERS **/

    interface BodyMemory {
        type: BodyType,
        minimumEnergy: number,
        constantParts: BodyPartConstant[],
        scalingParts: BodyPartConstant[],
        maxCompleteScaling: number,
        completeScalingPartsOnly: boolean
    }

    interface VisualsMemory {
        drawNestMapStructures: boolean;
        drawNestMapSpecials: boolean;
    }


}
