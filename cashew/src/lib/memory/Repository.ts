import { IRepository } from "./IRepository";

export abstract class Repository<T extends { id: string, state: any }> implements IRepository<T> {
    private hydrate: (state: any) => T;
    //private mem: { [id: string]: T };
    private tableName: string;

    //constructor(memoryObject: { [id: string]: any }, hydrate: (state: any) => T) {        
    //    this.mem = memoryObject;
    //    this.hydrate = hydrate;
    //}

    constructor(tableName: string, hydrate: (state: any) => T) {
        this.tableName = tableName;
        this.hydrate = hydrate;
    }

    public add(item: T): void {          
        Memory[this.tableName][item.id] = item.state;        
    }

    public delete(item: T): void {
        delete Memory[this.tableName][item.id];
    }

    public find(id: string): T {
        var state = Memory[this.tableName][id];
        return this.hydrate(state);
    }

    public getState(id: string): any {
        return Memory[this.tableName][id];
    }
}
