export class StatefulArray<TState, T extends { state: TState }> extends Array<T> {
    private states: TState[];
    constructor(states: TState[], items: T[]) {
        super(...items);
        this.states = states;
    }

    push(...items: T[]): number {
        this.states.push(..._.map(items, p => p.state));

        return super.push(...items);
    }

    /** Removes the last element from an array and returns it. */
    pop(): T | undefined {
        this.states.pop();
        return super.pop();
    }

    ///**
    //  * Combines two or more arrays.
    //  * @param items Additional items to add to the end of array1.
    //  */
    //concat(...items: T[][]): T[] {
    //    this.states.concat(..._.map(items, inner => _.map(inner, p => p.state)));
    //    return super.concat(...items);
    //}
    
    /**
      * Removes the first element from an array and returns it.
      */
    shift(): T | undefined {
        this.states.shift();
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
            this.states.splice(start, deleteCount, ..._.map(items, p => p.state));
            return super.splice(start, deleteCount, ...items);
        }
        this.states.splice(start);
        return super.splice(start);
    }
    /**
      * Inserts new elements at the start of an array.
      * @param items  Elements to insert at the start of the Array.
      */
    unshift(...items: T[]): number {
        this.states.unshift(..._.map(items, p => p.state));
        return super.unshift(...items);
    }

    /**
      * Returns the this object after filling the section identified by start and end with value
      * @param value value to fill array section with
      * @param start index to start filling the array at. If start is negative, it is treated as
      * length+start where length is the length of the array.
      * @param end index to stop filling the array at. If end is negative, it is treated as
      * length+end.
      */
    fill(value: T, start?: number, end?: number): this {
        this.states.fill(value.state, start, end);
        return super.fill(value, start, end);
    }

    /**
      * Returns the this object after copying a section of the array identified by start and end
      * to the same array starting at position target
      * @param target If target is negative, it is treated as length+target where length is the
      * length of the array.
      * @param start If start is negative, it is treated as length+start. If end is negative, it
      * is treated as length+end.
      * @param end If not specified, length of the this object is used as its default value.
      */
    copyWithin(target: number, start: number, end?: number): this {
        this.states.copyWithin(target, start, end);
        return super.copyWithin(target, start, end);
    }

}
