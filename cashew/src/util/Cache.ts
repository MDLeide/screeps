// volatile cache

class CacheContents<T> implements ICacheContents<T>{
    [resourceIdentifier: string]: T;
}

export class Cache<T extends { id: string }> implements ICache<T>{
    private contents: ICacheContents<T>;

    constructor() {
        this.contents = new CacheContents<T>();
    }

    public tryAdd(item: T): boolean {
        if (this.contents.hasOwnProperty(item.id)) {
            return false;
        }
        this.contents[item.id] = item;
        return true;
    }

    public add(item: T): void {
        if (!this.tryAdd(item)) {
            throw Error('cache already contains item with id [' + item.id + ']');
        }
    }

    public tryGet(id: string): T | null {
        //todo: i dont think this is correct - i think there are cases where we have unintended behavior, like false and 0
        //if (this.contents[id]) {
        //    return this.contents[id];
        //}
        //todo: this might be better
        if (this.contents.hasOwnProperty(id)) {
            return this.contents[id];
        }
        return null;
    }

    public get(id: string): T {
        let item = this.tryGet(id);
        if (item === null) {
            throw Error('cache does not contain item with id [' + id + ']');
        }
        return item;
    }

    public has(id: string): boolean {
        return this.contents.hasOwnProperty(id);            
    }

    public clear(): void {
        for (let id in this.contents) {
            delete this.contents[id];
        }
    }
}

export interface ICache<T extends { id: string }> {
    //contents: ICacheContents<T>;

    add(item: T): void;
    tryAdd(item: T): boolean;

    get(id: string): T;
    tryGet(id: string): T | null;

    has(id: string): boolean;

    clear(): void;
}

export interface ICacheContents<TValue> {
    [resourceIdentifier: string]: TValue;
}

export interface IGenericCache<TKey, TValue> {
    add(key: TKey, item: TValue): void;
    tryAdd(key: TKey, item: TValue): boolean;

    get(key: TKey): TValue;
    tryGet(key: TKey): TValue | null;

    has(key: TKey): boolean;

    clear(): void;
}




