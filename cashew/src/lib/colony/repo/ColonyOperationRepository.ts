import { ColonyOperation } from "../ColonyOperation";
import { SpawnDefinition } from "../../spawn/SpawnDefinition";

import { Repository } from "../../memory/Repository";
import { IdArray } from "../../../util/IdArray";

export class ColonyOperationRepository extends Repository<ColonyOperation> {
    private static delegates: { [name: string]: (state: any) => ColonyOperation };

    constructor() {
        super(Memory.colonies, ColonyOperationRepository.hydrate)
    }

    public static register(name: string, hydrate: (state: any) => ColonyOperation) : void {
        ColonyOperationRepository.delegates[name] = hydrate;
    }

    private static hydrate(state: any): ColonyOperation {
        var op = this.delegates[state.name](state);
        op.state = state;
        return op;
    }
}
