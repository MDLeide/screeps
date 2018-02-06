/**
 * Provides base class for wrappers around native functions.
 */
export abstract class Seed<TScreepsClass> {
    private _obj: TScreepsClass;

    constructor(screepsObject: TScreepsClass) {        
        this._obj = screepsObject;
    }

    protected get screepsObject(): TScreepsClass {
        return this._obj;
    }
}