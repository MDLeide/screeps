import { Repository } from "../../memory/Repository";
import { OperationGroup } from "../OperationGroup";

export class OperationGroupRepo extends Repository<OperationGroup> {
    constructor() {
        super("operationGroups", OperationGroupRepo.hydrate)
    }

    private static hydrate(state: any): OperationGroup {
        var op = Object.create(OperationGroup.prototype);
        op.state = state;
        return op;
    }
}
