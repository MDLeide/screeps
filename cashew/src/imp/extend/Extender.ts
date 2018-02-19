//todo: refactor all extensions into typed-classes that decorate an object, rather than extend it direclty
import { Nut } from "../../lib/extend/Nut";
import { Seed } from "../../lib/extend/Seed";

import { ContainerNut } from "./nut/ContainerNut";
import { ContainerSeed } from "./seed/ContainerSeed";

import { CreepNut } from "./nut/CreepNut";
import { CreepSeed } from "./seed/CreepSeed";

import { RoomNut } from "./nut/RoomNut";
import { RoomSeed } from "./seed/RoomSeed";

import { SourceNut } from "./nut/SourceNut";
import { SourceSeed } from "./seed/SourceSeed";

import { SpawnNut } from "./nut/SpawnNut";
import { SpawnSeed } from "./seed/SpawnSeed";

import { ControllerNut } from "./nut/ControllerNut";
import { ControllerSeed } from "./seed/ControllerSeed";

import { RoleRepo } from "../../lib/creep/role/RoleRepo";

export class Extender {
    private static _extended = false;


    public static ExtendRoom: boolean = true;
    public static ExtendCreep: boolean = true;
    public static ExtendStructure: boolean = true;
    public static ExtendSpawn: boolean = true;
    public static ExtendContainer: boolean = true;
    public static ExtendSource: boolean = true;


    public static extend(): void {
        if (this._extended) {
            console.log("already extended.");            
            return;
        }
        
        //container        
        Object.defineProperties(StructureContainer.prototype, {
            'memory': {
                'get': function () {
                    if (!Memory.containers) {
                        Memory.containers = {};
                    }

                    if (!Memory.containers[this.id]) {
                        Memory.containers[this.id] = {
                            id: this.id,
                            tag: "",
                            tagId: ""
                        };
                    }

                    return Memory.containers[this.id];
                }
            }
        });

        Object.defineProperties(StructureContainer.prototype, {
            'nut': {
                'get': function () {
                    if (!this._nut) {
                        this._nut = new ContainerNut(new ContainerSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
        
        //controller
        Object.defineProperties(StructureController.prototype, {
            'memory': {
                'get': function () {
                    if (!Memory.controllers) {
                        Memory.controllers = {};
                    }

                    if (!Memory.controllers[this.id]) {
                        Memory.controllers[this.id] = {
                            id: this.id,
                            containerId: ""
                        };
                    }

                    return Memory.controllers[this.id];
                }
            }
        });

        Object.defineProperties(StructureController.prototype, {
            'nut': {
                'get': function () {
                    if (!this._nut) {
                        this._nut = new ControllerNut(new ControllerSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
                
        //creep
        Object.defineProperties(Creep.prototype, {
            'nut': {
                'get': function () {
                    if (!this._nut) {
                        this._nut = new CreepNut(new CreepSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
                
        //room
        Object.defineProperties(Room.prototype, {
            'nut': {
                'get': function () {
                    if (!this._nut) {
                        this._nut = new RoomNut(new RoomSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
        
        //source
        Object.defineProperties(Source.prototype, {
            'memory': {
                'get': function () {
                    if (!Memory.sources) {
                        Memory.sources = {};
                    }

                    if (!Memory.sources[this.id]) {
                        Memory.sources[this.id] = {
                            id: this.id,
                            isBeingHarvested: false
                        };
                    }
                    return Memory.sources[this.id];
                }
            }
        });

        Object.defineProperties(Source.prototype, {
            'nut': {
                'get': function () {
                    if (!this._nut) {
                        this._nut = new SourceNut(new SourceSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
               
        //spawn
        Object.defineProperties(StructureSpawn.prototype , {
            'nut': {
                'get': function () {                    
                    if (!this._nut) {                        
                        this._nut = new SpawnNut(new SpawnSeed(this), this.memory);
                    }
                    return this._nut;
                }
            }
        });
        
        this._extended = true;
    }    
}
