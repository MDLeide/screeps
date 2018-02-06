import { Seed } from "./Seed";
import { Nut } from "./Nut";

export abstract class StatefulNut<TScreepsClass, TSeed extends Seed<TScreepsClass>, TState> extends Nut<TScreepsClass, TSeed> {
    constructor(seed: TSeed, state: TState) {
        super(seed);
        this.state = state;
    }

    public state: TState;
}