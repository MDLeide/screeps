import { Colony } from "../colony/Colony";
import { Empire } from "./Empire";
import { Operation } from "../operation/Operation";

export abstract class Campaign {
    private ops:{ }


    public load(empire: Empire): void {

    }

    public update(empire: Empire): void {

    }

    public execute(empire: Empire): void {

    }

    public cleanup(empire: Empire): void {

    }


}
