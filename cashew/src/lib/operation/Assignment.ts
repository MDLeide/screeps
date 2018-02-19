import { Body } from "../spawn/Body";

export class Assignment {
    public static fromMemory(memory: AssignmentMemory): Assignment {
        return new this(
            memory.creepName,
            Body.fromMemory(memory.body),
            memory.roleId);
    }

    constructor(
        public creepName: string,
        public body: Body,
        public roleId: string) {
    }

    public save(): AssignmentMemory {
        return {
            creepName: this.creepName,
            body: this.body.save(),
            roleId: this.roleId
        };
    }
}
