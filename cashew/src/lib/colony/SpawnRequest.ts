import { Body } from "../creep/Body";

export class SpawnRequest {
    public static fromMemory(memory: SpawnRequestMemory): SpawnRequest {        
        return new this(memory.name, Body.fromMemory(memory.body), memory.priority);
    }

    constructor(name: string, body: Body, priority?: number) {
        this.name = name;
        this.body = body;
        this.priority = priority ? priority : 0;
    }

    public name: string;
    public priority: number;
    public body: Body;

    public save(): SpawnRequestMemory {
        return {
            name: this.name,
            priority: this.priority,
            body: this.body.save()
        };
    }
}
