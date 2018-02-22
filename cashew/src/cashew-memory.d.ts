import { IRoleState } from "./lib/creep/role/state/IRoleState";

declare global {
    /** FLAGS */

    interface ColonyFlagMemory {
        name: string;
        plan: string;
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
        plan: ColonyPlanMemory;
    }

    interface ColonyPlanMemory {
        name: string;
        description: string;
        milestoneIndex: number;
        operationGroup: OperationGroupMemory;
    }

    interface NestMemory {
        roomName: string;
        map: NestMapMemory;
    }
    
    /**  END MANAGEMENT UNITS **/


    /** OPERATIONS **/

    interface OperationMemory {
        name: string;
        initialized: boolean;
        started: boolean;
        finished: boolean;
        cancelMilestoneId: string;
        assignments: AssignmentMemory[];

    }

    interface OperationGroupMemory {
        newOperations: OperationMemory[];
        initializedOperations: OperationMemory[];
        startedOperations: OperationMemory[];
        completedOperationNames: string[];
    }

    interface AssignmentMemory {
        creepName: string;
        body: BodyMemory;
        roleId: string;
        controllerName: string;
        controller: CreepControllerMemory;
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

    interface BodyMemory {
        name: string,
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

    interface CreepControllerMemory {
        name: string;
    }
}
