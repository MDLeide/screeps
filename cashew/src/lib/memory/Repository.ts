export abstract class Repository<T extends { id: string, state: any }> {
    private hydrate: (state: any) => T;
    private mem: { [id: string]: T };


    constructor(memoryObject: { [id: string]: T }, hydrate: (state: any) => T) {
        this.mem = memoryObject;
        this.hydrate = hydrate;
    }

    public add(item: T): void {
        this.mem[item.id] = item.state;
    }

    public delete(item: T): void {
        delete this.mem[item.id];
    }

    public get(id: string): T {
        return this.hydrate(this.mem[id]);
    }

    public getState(id: string): any {
        return this.mem[id];
    }
}
