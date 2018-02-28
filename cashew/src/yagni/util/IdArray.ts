export class IdArray<T extends { id: string }> extends Array<T> {
    private stateObject: string[];
    constructor(stateObject: string[], items?: T[]) {
        super(...items);
        this.stateObject = stateObject;
    }

    push(...items: T[]): number {
        this.stateObject.push(..._.map(items, p => p.id));
        return super.push(...items);
    }

    /** Removes the last element from an array and returns it. */
    pop(): T | undefined {
        this.stateObject.pop();
        return super.pop();
    }

    shift(): T | undefined {
        this.stateObject.shift();
        return super.shift();
    }

    /**
  * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
  * @param start The zero-based location in the array from which to start removing elements.
  */
    splice(start: number): T[];
    /**
      * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
      * @param start The zero-based location in the array from which to start removing elements.
      * @param deleteCount The number of elements to remove.
      * @param items Elements to insert into the array in place of the deleted elements.
      */
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        if (deleteCount !== null && deleteCount !== undefined) {
            this.stateObject.splice(start, deleteCount, ..._.map(items, p => p.id));
            return super.splice(start, deleteCount, ...items);
        }
        this.stateObject.splice(start);
        return super.splice(start);
    }
}
