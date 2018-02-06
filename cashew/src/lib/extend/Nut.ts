import { Seed } from './Seed';

/**
 * Provides base class for extension methods for the built in Screep classes.
 */
export abstract class Nut<TScreepsClass, TSeed extends Seed<TScreepsClass>> {
    private _seed: TSeed;

    constructor(seed: TSeed) {
        this._seed = seed;
    }

    public get seed(): TSeed {
        return this._seed;
    }
}