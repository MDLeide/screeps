import { Colony } from "../colony/Colony";
import { ColonyRepository } from "../colony/repo/ColonyRepository"

export class Empire {
    private _colonies: Colony[];
    private _colonyRepo: ColonyRepository = new ColonyRepository();


    public get colonies(): Colony[] {
        if (!this._colonies) {
            this._colonies = [];
            for (var key in Memory.colonies) {
                this._colonies.push(this._colonyRepo.get(key));
            }
        }
        return this._colonies;
    }

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

    public addColony(colony: Colony): void {
        this.colonies.push(colony);
        Memory.colonies[colony.id] = colony.state;
    }

    public removeColony(colony: Colony): void {
        var removeAt = -1;
        for (var i = 0; i < this.colonies.length; i++) {
            if (this.colonies[i].id == colony.id) {
                removeAt = i;
                break;
            }
        }

        if (removeAt >= 0) {
            delete Memory.colonies[colony[removeAt]];
            this.colonies.splice(removeAt);
        }
    }

}
