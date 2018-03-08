# Black Cat
*An AI created for the game Screeps by Cashew The Cat*

This repository contains the code I am using for the excellent, unique game [Screeps](http://screeps.com "Screeps"), which has similar design to a real-time strategy, but where the player must write JavaScript* to control their structures and units. There is no direct 'point and click' interface.

The codebase is written entirely in TypeScript, and uses the starter package, linked below.

Currently the code is focused primarily on economy and room management, with some very basic military code for defense. As these features are flushed out, the software will expand into other areas such as automated claiming, market activities, more sophisticated military operations, etc. Following is a loosely organized description of the software, written primarily to provide myself with some concrete reference of how everything works, and help create some design guidelines.


\*Or [any language](http://docs.screeps.com/third-party.html "Other Languages") that compiles to JavaScript. [TypeScript](https://www.typescriptlang.org/ "TypeScript") is a particularly popular choice, providing static type checking with JavaScript like syntax, and has a [starter package](https://github.com/screepers/screeps-typescript-starter "TypeScript Starter") specifically for Screeps available.

# Architecture

## Loop Participant
There are two primary parts of the project, `lib` consists of classes which provide common functionality, and could, in theory, be taken and used to build a completely separate AI. `imp` is there the implementation exists, and provides things like creep logic, room management, etc.

`main.js` is very simple, outside the main loop it extends the global object with some constants (more on that below) and instantiates and initializes an `Execute` object. Inside the look, `execute.main()` is called, which drives the AI.

Inside `execute.init()` there are some memory management tasks (to ensure good structure), some additional global extensions for convenience and debugging purposes, and registrations for a variety of objects (again, more on this below).

The `main()` loop creates all object from scratch each tick (possibly subject to change with the introduction of a stable IVM) by creating an `Empire` object, which is the top-level for all other logic.

## Memory
Given the nature of Screeps, it is required that we persist all state data each tick. Since `Memory` is a different object each tick, it is important to manage this process carefully. 

All classes which require persistent data provide three things, an interface describing their memory `interface HarvestControllerMemory`, a method for getting that data `save(): HarvestControllerMemory { ... }`, and a static method for hydrating an instance `HarvestController.fromMemory(memory: HarvestControllerMemory): HarvestController { ... }`.

## Execution Cycle
Execution starts with an initialization phase, which is triggered by a patch, VM switch, or some other event which causes the loss of volatile memory. 

After the initialization phase, the main loop begins, which will execute repeatedly until an event triggers another initialization. The main loop executes 5 methods, in order, on all objects. `Load()` -> `Update()` -> `Execute()` -> `Cleanup()` -> `Save()`.

`Load()` gives a class the chance to get any game objects it needs, by way of `Game.getObjectById`. 
`Update()` allows a class to collect data and update its state.
`Execute()` is where the main logic of the class is executed.
`Cleanup()` provides an opportunity for post execution data gathering and clean up.
`Save()` persist data back to the memory object.

This pattern is applied throughout the project, but is not enforced by an interface or system of any sort. Some classes take parameters in these methods. This may eventually be refactored so that they can all be treated equally, which may lend itself to porting into an OS style system.


![Execution Cycle](http://image.ibb.co/c432DS/execution_small.png)

<br>

# Domain

## Empire
The `Empire` is the highest level control unit, and constitutes the entirety of a player's Screeps activities. It controls and directs from a birds-eye view, identifying new potential `Colonies` and informing existing `Colonies` of suggested plans and marketing actions.  
#### TODO: MORE

## Colony
`Colonies` are the main control units for `rooms` and economic activities. They consist of a `nest`, the main `room` of the `colony`, explained in further detail below, and `expansions`, which are remote mining rooms.  There is also a `population` object which allows easy analysis of creeps. A colony tracks its state using a `progress` object, which has a collection of `milestones`. When a `milestone` is met, it raises a flag, and other interested parties may react to that flag. `colonyPlans` are one of those parties, which are responsible for creating and managing `operations`.

## Nest
The `nest` is the core of a `colony`. A `nest`, technically speaking, is any `room` which has a `spawn`, each `nest` belongs to exactly one `colony` and each `colony` has exactly one `nest`. All spawning is handled by the `nest` which distributes the work to one of its `spawners`, an object which wraps the native `spawn`. The nest uses a `nestMap`, which is generated with the `colony`, to determine when and where to build structures, important locations, cost matrices, etc. 

## Expansion
#### TODO

## Operation
An `operation` groups `creeps` to perform a focused task, such as building a set of structures, harvesting `energy` from a source, upgrading a controller, repairing roads, etc. An `operation` has four phases, `initial`, `initialized`, `started`, and `finished`. It defines when it is available to advance to each phase. Additionally, it defines its `creep` requirements, and once enough have been assigned can be started. After starting, it controls its assigned `creeps` directly, or by executing their `role` - either way, the `operation` is responsible for managing the `creeps` that have been assigned to it. To be clear, when `execute()` is called on the `operation`, it 'ticks' all of its `creeps`. All `creeps` are managed through `operations`. 

## Operation Group
An `operation group` manages one or more `operations`, and all `operations` are executed through an `operation group`. It tracks the phase of each `operation`, performing checks and updates as necessary. It is also responsible for spawning `creeps` for the `operations`. By checking with each `operation` for its requirements, it calls back to the `colony` that is currently managing the group and asks for spawns.
	
	
<br>


# Operations

## Contents
### Maintenance Operations
1. Repair Structures
2. Repair Roads
3. Repair Walls
4. Cleanup Fallen Energy
5. Defend Room

### Economy Operations
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
18. Energy Transport
    
### Milestones
1. Control [*control*]
2. Spawn [*spawn*]
3. Source Containers [*harvestContainers*]
4. RCL2 [*rcl2*]
5. 5 Extensions [*fiveExtensions*]
6. Upgrade Container [*upgradeContainer*]
7. RCL3 [*rcl3*]
8. First Tower [*firstTower*]
9. RCL4 [*rcl4*]
10. Storage [*storage*]
11. RCL5 [*rcl5*]
12. Second Tower [*secondTower*]
13. First Link Set [*firstLinks*]

## Descriptions

### Collapse Recovery

### First Spawn Construction

### Harvest Container Construction
Creeps should be designated to mine from a specific source, and construct a particular container.
+ Mine energy from source
+ Deliver energy to spawn
+ Build container

### Heavy Harvest Container
A single heavy creep should be assigned to a source which it will harvest and transfer to a container. Periodically repair the container.
+ Move to source
+ Harvest
+ Transfer
+ Repair

### Light Upgrade
Several light upgraders should ask the Colony to withdraw energy. Use this energy to upgrade the controller.
+ Withdraw
+ Upgrade

### RCL2 Extension Construction
Create sites, construct 5 extensions, requesting energy from the Colony.
+ Withdraw
+ Build

### Upgrade Container Construction
Create site, build upgrade container.
+ Withdraw
+ Build

### Energy Transport
Ask the Colony for Withdraw and Transfer targets.
+ Withdraw
+ Transfer


<br>


# Plans
## Standard Plan



### Control
*The Room is under your control*  
Start constructing a `spawn`.  

+ First Spawn Construction


### Spawn  
*A Spawn exists* [spawn]
Start constructing `source` `containers`.
  
+ Harvest Container Construction


### Source Containers
*`Source` `containers` exist for each `source` in the `room`* [harvestContainers]
Start harvesting the `sources` and upgrading the `controller`.  

+ Heavy Harvest Container
+ Heavy Harvest Container
+ Light Upgrade
 

### RCL2
*`Room` has reached `RCL` 2* [rcl2]  
Construct 5 `extensions`, continue to harvest the `sources` and upgrade the `controller`.

+ RCL2 Extension Construction
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Light Upgrade*
 

### 5 Extensions
*`Room` has 5 `extensions` completed* [fiveExtensions]  
Construct `controller` `containers` and start transport operations, continue to harvest the `sources` and upgrade the `controller`.

+ Controller Container Construction
+ Energy Transport
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Light Upgrade*


### Upgrade Container
*`Room` has upgrade `container` completed* [upgradeContainer]  
Start heavy `controller` upgrade using the new `container`, continue to harvest the `sources` and transport `energy`. Cancel the previous `controller` upgrade. 

+ Heavy Upgrade Container
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ ~~Light Upgrade~~


### RCL3
*`Room` has reached `RCL` 3* [rcl3]
Construct first `tower`, continue to harvest the `sources`, transport `energy`, and upgrade the `controller`.

+ First Tower Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### First Tower
*`Room` has its first tower* [firstTower]
Construct 5 additional `extensions`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ RCL3 Extension Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### RCL4
*`Room` has reached `RCL` 4* [rcl4]
Construct `storage`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ Storage Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### Storage
*`Room` has `storage` completed* [storage]
Construct 10 additional `extensions`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ RCL4 Extension Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### RCL5
*`Room` has reached `RCL` 5* [rcl5]
Construct second `tower`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ Second Tower Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### Second Tower
*`Room` has second `tower` completed* [secondTower]
Construct first two `links`, continue to harvest `sources`, transport `energy`, and upgrade the `controller`.

+ First Link Set Construction
+ *Energy Transport*
+ *Heavy Harvest Container*
+ *Heavy Harvest Container*
+ *Heavy Upgrade Container*


### First Link Set
*`Room` has two `links` completed* [firstLinks]
Setup hybrid `link` upgrader and first `link` harvester, continue to harvest a single `source` and transport `energy`. Cancel one of the `container` harvesters, and the `container` upgrader.

+ Heavy Harvest Link
+ Heavy Upgrade Hybrid
+ *Heavy Harvest Container*
+ ~~Heavy Upgrade Container~~
+ ~~Heavy Harvest Container~~


<br>


# Debug and Utils

## Logger 
<div style="background-color:#222222; padding:10"><font color='#777777'>Identifiers (types): <font color='#006000'>Dark Green</font>
Names (ids): <font color='#AAAAFF'>Light Blue</font>
Important Positive Verbs (achievements): <font color='#FF7F00'>Orange</font>
Important Negative Verbs (attacks, critical system failure): <font color='#DD0000'>Red</font>
Positive Verbs (creep born, op started/finished): <font color='#DDDD00'>Yellow</font>
Negative Verbs (role error): <font color='#800080'>Purple</font>
Neutral Verbs(creep death, op init, creep assigned): <font color='#D2B48C'>Tan</font>
<h4>Empire Messages</h4>**Colony Established**
<font color='#006000'>Colony </font> <font color='#AAAAFF'>E24S21</font> has <font color='#FF7F00'>been established</font>
**Mapping Messages**
<font color='#006000'>Map Builder</font> <font color='#DD0000'>failed to create</font> <font color='#006000'>Extension Block </font> for <font color='#006000'>Nest</font> <font color='#AAAAFF'>W13S32</font>
**GCL Upgrade**
<font color='#FF7F00'>The Empire has risen to <font color='#006000'>GCL</font> <font color='#AAAAFF'>8</font></font> 
<h4>Colony Messages</h4>**Creep Spawning**
<font color='#006000'>Nest</font> <font color='#AAAAFF'>E23S10</font> is <font color='#DDDD00'>spawning</font> a <font color='#006000'>creep</font> named <font color='#AAAAFF'>lightWorker-spawn1-2012</font> with <font color='#006000'>body</font> type <font color='#AAAAFF'>lightWorker</font>
**RCL Upgrade**
<font color='#006000'>Nest</font> <font color='#AAAAFF'>E23S10</font> has <font color='#FF7F00'>upgraded</font> to <font color='#006000'>RCL</font> <font color='#AAAAFF'>4</font>
**Under Attack**
<font color='#006000'>Nest</font> <font color='#AAAAFF'>E23S10</font> is <font color='#DD0000'>under attack</font>
<h4>Colony Plan</h4>**Milestone Met**
<font color='#006000'>Colony</font> <font color='#AAAAFF'>E23S10</font> <font color='#FF7F00'>has met the</font> <font color='#006000'>milestone</font> <font color='#AAAAFF'>fiveExtensions</font>
<h4>Operation Messages</h4>**Status Change**
<font color='#006000'>Operation</font> <font color='#AAAAFF'>harvest</font> has <font color='#D2B48C'>initiated</font>
<font color='#006000'>Operation</font> <font color='#AAAAFF'>towerConstruction</font> has <font color='#DDDD00'>started</font>

</font></div>



#### Empire Messages
Colony Established
Mapping Messages
GCL Upgrade 

#### Colony Messages
Creep Spawning
RCL Upgrade
Under Attack

#### Colony Plan
Milestone Met

#### Operation Messages
Status Change
Creep Assigned
Creep Released

#### Creep Messages
Born
Died
Role Assigned
Role Error

#### Debug Messages
Playback Messages
Status Change
Flag Created

## Playback

## Cleaner
