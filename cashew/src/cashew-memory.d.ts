import { Execute } from "./imp/Execution"; // silly hack that i don't understand - this isn't actually used
import { MonitorStatus } from "lib/monitor/Monitor";
import { FlagOperation } from "lib/operation/FlagOperation";

declare global {
    interface SystemMemory {
        name: string;
        major: number;
        minor: number;
        patch: number;
        /** Milliseconds since epoch. */
        lastUpdate: number;
        debug: boolean;
        resetHistory: number[];
        codeChangeHistory: number[];
    }


    /** MANAGEMENT UNITS **/

    interface EmpireMemory {
        colonies: { [colonyName: string]: ColonyMemory };
        exchange: ExchangeMemory;
        monitorManager: MonitorManagerMemory;
    }

    interface ColonyMemory {        
        name: string;
        nest: NestMemory;        
        resourceManager: ResourceManagerMemory;
        remoteMiningManager: RemoteMiningManagerMemory;
        watchtower: WatchtowerMemory;
        monitorManager: MonitorManagerMemory;
        operations: OperationGroupMemory;
        campaigns: CampaignMemory[];
    }

    interface NestMemory {
        roomName: string;
        map: NestMapMemory;
        spawnEnergyStructureOrderIds: string[];
        spawnQueue: SpawnRequestMemory[];
        spawnStats: SpawnStatTrackerMemory;
    }

    /**  END MANAGEMENT UNITS **/


    /** MONITORS **/

    interface EmpireMonitorMemory extends MonitorMemory {
    }

    interface ColonyMonitorMemory extends MonitorMemory {
    }

    interface MonitorMemory {
        type: MonitorType;
        status: MonitorStatus;
        sleepingFor: number;
    }

    interface MonitorManagerMemory {
        monitors: MonitorMemory[];
        provider: MonitorProviderType;
    }
        
    /** END MONITORS **/


    /** COMPONENTS */

    interface ResourceManagerMemory {
        settings: ResourceManagerSettingsMemory;
        structures: ResourceManagerStructureMemory;
        ledger: ResourceManagerLedgerMemory;
        sourceAId: string;
        sourceBId: string;
        extensionsManagedDirectly: boolean;
    }

    interface ResourceManagerSettingsMemory {
        transferPriority: number[];
    }

    interface ResourceManagerStructureMemory {
        sourceAContainerId: string;
        sourceALinkId: string;
        sourceBContainerId: string;
        sourceBLinkId: string;
        controllerContainerId: string;
        storageLinkId: string;
        extensionLinkId: string;
        controllerLinkId: string;
        storageContainerIds: string[];
    }

    interface ResourceManagerLedgerMemory {
        lastTick: ResourceManagerLedgerPeriodMemory;
        currentGeneration: ResourceManagerLedgerPeriodMemory;
        lastGeneration: ResourceManagerLedgerPeriodMemory;
        history: ResourceManagerLedgerPeriodMemory[];
        historyMaxLength: number;
        tickOffset: number;
    }

    interface ResourceManagerLedgerPeriodMemory {
        startTick: number;
        ticks: number;

        harvestEnergy: number;
        remoteHarvestEnergy: number;
        empireIncomingEnergy: number; // energy received from elsewhere in the empire
        marketBuyEnergy: number;

        spawnEnergy: number;
        upgradeEnergy: number;
        buildEnergy: number;
        repairEnergy: number;
        empireOutgoingEnergy: number;
        marketSellEnergy: number;
        terminalTransferEnergy: number;
        linkTransferEnergy: number;

        netEnergy: number;
    }

    interface SpawnRequestMemory {
        name: string;
        priority: number;
        body: BodyMemory;
        tickCreated: number;
    }

    interface RemoteMiningManagerMemory {
        rooms: RemoteRoomMemory[];
    }

    interface RemoteRoomMemory {
        name: string;
        scouted: boolean;
        beingScouted: boolean;
        remoteSources: RemoteSourceMemory[];
        beingReserved: boolean;
    }

    interface RemoteSourceMemory {
        sourceId: string;
        containerId: string;
        beingMined: boolean;
        profit: number;
    }

    interface WatchtowerMemory {
        threatScore: number;
        attackTargetId: string;
        healTargetName: string;
    }

    interface SpawnStatTrackerMemory {
        currentPeriod: SpawnStatMemory;
        history: SpawnStatMemory[];
    }

    interface SpawnStatMemory {
        periodStart: number;
        adjustedTicksSpentSpawning: number;
    }

    interface ExchangeMemory {
        supplyOrders: { [orderId: string]: OrderMemory };
        demandOrders: { [orderId: string]: OrderMemory };
        transactions: { [transactionId: string]: TransactionMemory };
    }

    interface TransactionMemory {
        supplyOrderId: string;
        demandOrderId: string;
        quantity: number;
        complete: boolean;
    }

    interface OrderMemory {
        id: string;
        type: number;
        colony: string;
        resource: ResourceConstant;
        quantity: number;
        tickCreated: number;
        canceled: boolean;

        reservedQuantity: number;
        unreservedQuantity: number;
        filledQuantity: number;
        unfilledQuantity: number;

        reservedBy: { [orderId: string]: number };
        filledBy: { [orderId: string]: number };
    }

    /** END COMPONENTS */


    /** OPERATIONS **/

    interface OperationMemory {
        type: OperationType;
        initializedStatus: number;
        startedStatus: number;
        operationStatus: number;
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

    interface CampaignMemory {
        operations: OperationMemory[];
        type: CampaignType;
    }

    interface AssignmentMemory {
        creepName: string;
        body: BodyMemory;
        controllerType: CreepControllerType;
        replaceAt: number;
        replacementName: string;
        onHold: boolean;
        supportRequest: BodyMemory;
        maxSupportRange: number;
    }

    interface FlagOperationMemory {
        type: FlagOperationType;
        hostColony: string;
    }

    interface FlagCampaignMemory {
        type: FlagCampaignType;
        hostColony: string;
    }

    /** END OPERATIONS **/


    /** MILITARY **/

    interface UnitMemory {
        memberNames: string[];
    }

    interface UnitControllerMemory {
        type: UnitControllerType;
    }

    interface UnitJobMemory extends UnitControllerMemory {
        complete: boolean;
    }

    /** END MILITARY **/


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
        mineralBlock: MapBlockMemory;
    }
    
    /** END MAPS **/


    /** CREEP CONTROLLERS **/

    interface CreepControllerMemory {
        type: CreepControllerType;
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


    /** MISC **/

    interface BodyMemory {
        type: BodyType,
        minimumEnergy: number,
        constantParts: BodyPartConstant[],
        scalingParts: BodyPartConstant[],
        maxCompleteScaling: number,
        completeScalingPartsOnly: boolean,
        waitForFullEnergy: boolean
    }

    interface VisualsMemory {
        [name: string]: boolean;
    }

    interface ColonyVisualMemory {
        drawGeneralInfo: boolean;
        drawStructures: boolean;
        drawSpecialTokens: boolean;
        drawEnergyStats;
        drawDetailedPopulation: boolean;
        drawDetailOperations: boolean;
    }

    interface PlaybackFlagMemory {
        pauseOnException: boolean;

        doOutput: boolean;
        outputColor: string;

        playbackState: string;
        lastPlaybackState: string;
    }

    /** END MISC **/    
}
