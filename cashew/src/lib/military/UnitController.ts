import { Unit } from "./Unit";

export abstract class UnitController {
    public abstract update(unit: Unit): void;
    public abstract execute(unit: Unit): void;
    public abstract cleanup(unit: Unit): void;
}
