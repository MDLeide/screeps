import { Repository } from "../../memory/Repository";
import { Nest } from "../Nest";

export class NestRepository extends Repository<Nest> {
    constructor() {
        super("nests", NestRepository.hydrate)
    }

    private static hydrate(state: any): Nest {
        var nest = Object.create(Nest.prototype);
        nest.state = state;
        return nest;
    }
}
