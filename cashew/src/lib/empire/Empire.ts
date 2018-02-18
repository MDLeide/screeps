import { ColonyFinder } from "./ColonyFinder";
import { Colony } from "../colony/Colony";
import { NestMapBuilder } from "../map/NestMapBuilder";

export class Empire {
    constructor(nestMapBuilder: NestMapBuilder) {
        this.colonies = [];
        for (var key in Memory.empire.colonies)
            this.colonies.push(Colony.fromMemory(Memory.empire.colonies[key]));
        this.nestMapBuilder = nestMapBuilder;
    }
    

    public colonies: Colony[];
    public nestMapBuilder: NestMapBuilder;


    //## update loop

    public load(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].load();
        }
    }
    
    public update(): void {        
        ColonyFinder.createNewColonies(this, this.nestMapBuilder);

        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].update();
        }        
    }

    public execute(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].execute();
        }
    }

    public cleanup(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].cleanup();
        }
    }

    public save(): EmpireMemory {
        var colonies: { [name: string]: ColonyMemory } = {};
        for (var i = 0; i < this.colonies.length; i++)
            colonies[this.colonies[i].name] = this.colonies[i].save();
        return {
            colonies: colonies
        };
    }

    //## end update loop

    
    /** Adds a colony to the empire and memory. */
    public addColony(colony: Colony): void {
        this.colonies.push(colony);
    }

    /** Removes a colony from the empire. */
    public removeColony(colony: Colony): void {
        var removeAt = -1;
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].name == colony.name) {
                removeAt = i;
                break;
            }
        }

        if (removeAt >= 0)             
            this.colonies.splice(removeAt, 1);        
    }
}
