import { Body } from "../creep/Body";

export class SpawnRequest {
    public static fromMemory(memory: SpawnRequestMemory): SpawnRequest {        
        let req = new this(memory.name, Body.fromMemory(memory.body), memory.priority, memory.tickCreated);        
        return req;
    }

    constructor(name: string, body: Body, priority?: number, tick?:number) {
        this.name = name;
        this.body = body;
        this.priority = priority ? priority : 0;
        this.tickCreated = tick ? tick : Game.time;
    }

    public name: string;
    public priority: number;
    public body: Body;
    public tickCreated: number;
    public get age(): number {
        if (!this.tickCreated)
            return 0;
        return Game.time - this.tickCreated;
    }

    public save(): SpawnRequestMemory {
        return {
            name: this.name,
            priority: this.priority,
            body: this.body.save(),
            tickCreated: this.tickCreated
        };
    }
}
