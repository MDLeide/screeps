# Black Cat
*An AI created for the game Screeps by Cashew The Cat*

(This documentation is outdated in places, containing bad information on program architecture and operation. To be updated sometime in the next century.)

This repository contains the code I am using for the excellent, unique game [Screeps](http://screeps.com "Screeps"), which has similar design to a real-time strategy, but where the player must write JavaScript* to control their structures and units. There is no direct 'point and click' interface.

The codebase is written entirely in TypeScript, and uses the starter package, linked below.

Currently the code is focused primarily on economy and room management, with some very basic military code for defense. As these features are flushed out, the software will expand into other areas such as automated claiming, market activities, more sophisticated military operations, etc. Following is a loosely organized description of the software, written primarily to provide myself with some concrete reference of how everything works, and help create some design guidelines.


\*Or [any language](http://docs.screeps.com/third-party.html "Other Languages") that compiles to JavaScript. [TypeScript](https://www.typescriptlang.org/ "TypeScript") is a particularly popular choice, providing static type checking with JavaScript like syntax, and has a [starter package](https://github.com/screepers/screeps-typescript-starter "TypeScript Starter") specifically for Screeps available.

# Architecture

## Loop Participant
Objects will participate in the 'tick loop' according a specifically ordered set of methods, `update()`, `execute()`, and `cleanup()`. Class can implement the `LoopParticipant` interface to participate. 

`Update()` will first be called on all objects. This allows data collection and state updates.

Next, `execute()` is called on each. This is where the main logic of the class should execute, performing actions, talking to other components, and interacting with the game world. No state changes should occur, rather they should be cached for the `cleanup` phase. This is to ensure that order of execution does not have affect the program.

Finally, `cleanup()` is called to allow another round of state updates and other finalization tasks.

```
interface LoopParticipant {
	update(): void;
	execute(): void;
	cleanup(): void;
}
```


## Object Creation
Each object which requires a persistent state takes an `IState` object as an optional argument. This object is used to persist data to the `Memory` tree. When building an object for the first time, such as the first time construction of a new `colony` or `role`, the `IState` object can be omitted, all classes are capable of initializing to a default state. Alternatively, the creator of the object may opt to build and pass in an `IState` object, providing some non-default configuration.

For classes which require reference to game objects such as `structures` or `creeps`, it is preferable that they request an ID, rather than a reference, and maintain responsibility for retrieving the object itself using `Game.GetObjectById`.

After a volatile memory wipe, all objects are recreated by calling their constructors and passing their associated `IState` object. More information on this process is found below in the **Memory** section.


## Memory
Given the nature of Screeps, it is required that we persist all state data each tick. Since `Memory` is a different object each tick, it is important to manage this process carefully. To meet the requirements, the following structure has been designed.

Any class which requires persistent data will implement the `IPeristent` interface.

At the end of each tick, any object implementing this interface will have `save()` called, and the resulting state object will be placed somewhere on the `Memory` tree. It may be the case that a class calls down to some number of children with the `save()` method, and places the state object on its own state object.

At the start of each tick, this data will be retrieved and provided to the objects via the `Load(state: T)` method. The implementing class will use this state data to synchronize with the `Memory` tree. **_is this necessary? what is the case where an object provided it state one tick, and now has different data, outside of memory wipes?_**

On first load after a patch has been pushed, or the VM has changed, or some other trigger has caused our volatile memory to be wiped, all objects must be reconstructed. This will be done by calling the classes constructor and providing the `IState` object that has been placed on the `Memory` tree. This will be used to rehydrate the object to the state it was in prior to the reset.

```
interface IPersistent<T extends IState> {
	load(state: T): void;
	save(): T;
}

interface IState {	
}
```

## Execution Cycle
Execution starts with an initialization phase, which is triggered by a patch, VM switch, or some other event which causes the loss of volatile memory. During the initialization phase, objects are recreated from their state objects on the `Memory` tree, prototypes are extended, the `Memory` object is checked to be well formed, and some debugging and logging activites are performed **todo: more information**. Some classes may also require registrations, which are done here as well. 

After the initialization phase, the main loop begins, which will execute repeatedly until an event triggers another initialization. The main loop executes 5 methods, in order, on all objects. `Load()` -> `Update()` -> `Execute()` -> `Cleanup()` -> `Save()`. These methods have all been described above.

![Execution Cycle](https://image.ibb.co/kb0mbS/execution_small.png)

<br>

# Domain


## General
Most of the classes described below use a consistent mechanism for updating and executing each tick. `Update()` is called for all objects, then `Execute()` is called for all objects, and finally `Cleanup()` is called for all objects. This allows everything to gather data, operate on that data, and then clean up, in a predictable and 

## Empire
The `Empire` is the highest level control unit, and constitutes the entirety of a player's Screeps activities. It controls and directs from a birds-eye view, identifying new potential `Colonies` and informing existing `Colonies` of suggested plans and marketing actions.  
#### TODO: MORE

## Colony
`Colonies` are the main control units for `rooms` and economic activities. They consist of a `nest`, the main `room` of the `colony`, explained in further detail below, and `expansions`, which are remote mining rooms. Each `colony` has its own `queen` which directs it. Using a `colony plan` consisting of `milestones` to determine the progress of the `colony`, she invokes `operations` to grow and support her brood. Each `colony` also has a `colony map` which is used to direct pathing and the placement of structures. The `colony` also tracks its `creeps` using the `population` class.

## Nest
The `nest` is the core of a `colony`. A `nest`, technically speaking, is any `room` which has a `spawn`, each `nest` belongs to exactly one `colony` and each `colony` has exactly one `nest`. All spawning is handled by the `nest` which distributes the work to one of its `spawners`, an object which wraps the native `spawn`. The nest contains a `nest map` which explicitly describes the layout of its `structures` and at which `RCL` and `milestone` they should be built. 

## Expansion
#### TODO

## Operation
An `operation` groups `creeps` to perform a focused task, such as building a set of structures, harvesting `energy` from a source, upgrading a controller, repairing roads, etc. An `operation` has four phases, `initial`, `initialized`, `started`, and `finished`. It defines when it is available to advance to each phase. Additionally, it defines its `creep` requirements, and once enough have been assigned can be started. After starting, it controls its assigned `creeps` directly, or by executing their `role` - either way, the `operation` is responsible for managing the `creeps` that have been assigned to it. To be clear, when `execute()` is called on the `operation`, it 'ticks' all of its `creeps`. All `creeps` are managed through `operations`. 

## Operation Group
An `operation group` manages one or more `operations`, and all `operations` are executed through an `operation group`. It tracks the phase of each `operation`, performing checks and updates as necessary. It is also responsible for spawning `creeps` for the `operations`. By checking with each `operation` for its requirements, it calls back to the `colony` that is currently managing the group and asks for spawns.
	
	
<br>

# Operations

  
## Maintenance Operations
1. Repair Structures
2. Repair Roads
3. Repair Walls
4. Cleanup Fallen Energy
5. Defend Room

## Economy Operations
1. Collapse Recovery
2. Basic Maintenance
2. First Spawn Construction
3. Harvest Container Construction
4. Light Upgrade
5. Heavy Harvest Container
6. RCL2 Extension Construction
7. Controller Container Construction
8. Heavy Upgrade Container
9. First Tower Construction
10. RCL3 Extension Construction
11. Storage Construction
12. RCL4 Extension Construction
13. Second Tower Construction
14. First Link Set Construction
15. Heavy Harvest Link
16. Heavy Upgrade Hybrid
17. Heavy Upgrade Link
    

<br>

# Standard Plan



### Control
*The Room is under your control*  
Start constructing a `spawn`.  

+ First Spawn Construction


### Spawn  
*A Spawn exists*  
Start constructing `source` `containers`.
  
+ Harvest Container Construction


### Source Containers
*`Source` `containers` exist for each `source` in the `room`*  
Start harvesting the `sources`, upgrading the `controller`, and running basic maintenance  

+ Heavy Harvest Container
+ Heavy Harvest Container
+ Light Upgrade
+ Basic Maintenance
 

### RCL2
`Room` has reached `RCL` 2  
Construct 5 `extensions`, continue to harvest the `sources`, upgrade the `controller`, and run basic maintenance

+ RCL2 Extension Construction
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Light Upgrade*
+ *Basic Maintenance*
 

### 5 Extensions
`Room` has 5 `extensions` completed  
Construct `controller` `containers` and start transport operations, continue to harvest the `sources` and upgrade the `controller`. Cancel the basic maintenance operations and inform the `Colony` to start standard maintenance checks.

+ Controller Container Construction
+ Energy Transport
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Light Upgrade*
+ ~~Basic Maintenance~~


### Upgrade Container
`Room` has upgrade `container` completed  
Start heavy `controller` upgrade using the new `container`, continue to harvest the `sources` and transport `energy`. Cancel the previous `controller` upgrade. 

+ Heavy Upgrade Container
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ ~~Light Upgrade~~


### RCL3
`Room` has reached `RCL` 3
Construct first `tower`, continue to harvest the `sources`, transport `energy`, and upgrade the `controller`.

+ First Tower Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### First Tower
`Room` has its first tower
Construct 5 additional `extensions`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ RCL3 Extension Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### RCL4
`Room` has reached `RCL` 4
Construct `storage`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ Storage Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### Storage
`Room` has `storage` completed
Construct 10 additional `extensions`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ RCL4 Extension Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### RCL5
`Room` has reached `RCL` 5
Construct second `tower`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ Second Tower Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### Second Tower
`Room` has second `tower` completed
Construct first two `links`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ First Link Set Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### First Link Set
`Room` has two `links` completed
Setup hybrid `link` upgrader and first `link` harvester, continue to harvest a single `source` and transport `energy`. Cancel one of the `container` harvesters, and the `container` upgrader.

+ Heavy Harvest Link
+ Heavy Upgrade Hybrid
+ *Heavy Harvest Container*
+ ~~Heavy Upgrade Container~~
+ ~~Heavy Harvest Container~~


<br>


# Debug and Utils


## Logger

## Playback

## Cleaner
