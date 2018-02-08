import { Colony } from "../Colony";
import { Repository } from "../../memory/Repository"

export class ColonyRepository extends Repository<Colony> {
    constructor() {
        super(Memory.colonies, ColonyRepository.hydrate)
    }

    private static hydrate(state: any): Colony {
        var col = Object.create(Colony.prototype);
        col.state = state;
        return col;
    }
}
