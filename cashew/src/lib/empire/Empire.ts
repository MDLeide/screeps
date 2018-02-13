import { Colony } from "../colony/Colony";
import { NestMapBuilder } from "../map/NestMapBuilder";
import { ColonyRepository } from "../colony/repo/ColonyRepository"

export class Empire {
    private static _instance: Empire;

    private _colonies: Colony[];
    private _colonyRepo: ColonyRepository = new ColonyRepository();


    private constructor() {
    }

    
    public static getEmpireInstance(): Empire {
        if (!Empire._instance) {
            Empire._instance = new Empire();
        }
        return Empire._instance;
    }

    public nestMapBuilder: NestMapBuilder;

    public get colonies(): Colony[] {
        if (!this._colonies) {
            this._colonies = [];
            for (var key in Memory.colonies) {
                this._colonies.push(this._colonyRepo.find(key));
            }
        }
        return this._colonies;
    }



    //## update loop
    
    public update(): void {        
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].update(this);
        }
    }

    public execute(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].execute(this);
        }
    }

    public cleanup(): void {
        for (var i = 0; i < this.colonies.length; i++) {
            this.colonies[i].cleanup(this);
        }
    }

    //## end update loop
    
    /** Adds a colony to the empire and memory. */
    public addColony(colony: Colony): void {
        this.colonies.push(colony);
        this._colonyRepo.add(colony);
    }

    /** Removes a colony from the empire. */
    public removeColony(colony: Colony): void {
        var removeAt = -1;
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].id == colony.id) {
                removeAt = i;
                break;
            }
        }

        if (removeAt >= 0) {
            this._colonyRepo.delete(colony);
            this.colonies.splice(removeAt);
        }
    }
}
