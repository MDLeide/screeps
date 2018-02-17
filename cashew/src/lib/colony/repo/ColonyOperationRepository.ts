import { ColonyOperation } from "../ColonyOperation";
import { SpawnDefinition } from "../../spawn/SpawnDefinition";

import { Repository } from "../../memory/Repository";
import { IdArray } from "../../../util/IdArray";

export class ColonyOperationRepository extends Repository<ColonyOperation> {
    private static delegates: { [name: string]: (state: any) => ColonyOperation } = {};

    constructor() {
        super("operations", ColonyOperationRepository.hydrate)        
    }

    public static register(name: string, hydrate: (state: any) => ColonyOperation): void {
        if (!ColonyOperationRepository.delegates)
            ColonyOperationRepository.delegates = {};
        ColonyOperationRepository.delegates[name] = hydrate;
    }

    private static hydrate(state: any): ColonyOperation {
        var op = ColonyOperationRepository.delegates[state.name](state);
        return op;
    }
}
