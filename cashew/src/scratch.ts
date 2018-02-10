// c#



// typescript?
export class Foo {
    private _myBar: Bar;
    public get MyBar(): Bar {
        if (!this._myBar)
            this._myBar = new Bar();
        return this._myBar;
    }
}

export class Bar {
    
}
