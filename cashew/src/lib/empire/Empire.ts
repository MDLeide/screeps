import { Colony } from "../colony/Colony";

export class Empire {
    private _colonies: Colony[];


    public colonies: Colony[];

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
            this.colonies.splice(removeAt);
        }
    }

}
