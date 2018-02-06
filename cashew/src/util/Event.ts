export interface IEvent extends ITypedSenderEvent<any> {    
}

export interface ITypedSenderEvent<TSender> extends ITypedEvent<TSender, any> {
}

export interface ITypedEvent<TSender, TArgs extends EventArgs> {
    subscribe(delegate: (sender: TSender, eventArgs: TArgs) => void): void;
    unsubscribe(delegate: (sender: TSender, eventArgs: TArgs) => void): void;    
    raise(sender: TSender, eventArgs: TArgs): void;
}

export class EventArgs {
}

export class TypedEvent<TSender, TArgs extends EventArgs> {
    //todo: how does javascript perform function equality? are these methods broken when two seperate instance of the same class use the event?
    /*
    consider

    event.subscribe(fooA.handler);
    event.subscribe(fooB.handler);
    event.unsubscribe(fooA.handler);
    event.raise();

    */
    private _subscriptions: Array<(sender: TSender, EventArgs: TArgs) => void> = new Array<(sender: TSender, EventArgs: TArgs) => void>();
    
    constructor() {        
    }
    
    public subscribe(delegate: (sender: TSender, eventArgs: TArgs) => void): void {
        let i = this._subscriptions.indexOf(delegate);
        if (i >= 0) {
            throw Error('Already Subscribed.');
        }
        this._subscriptions.push(delegate);
    }

    public unsubscribe(delegate: (sender: TSender, eventArgs: TArgs) => void): void {
        let i = this._subscriptions.indexOf(delegate);
        if (i < 0) {
            throw Error('Not Subscribed.');
        }
        this._subscriptions.splice(i, 1);
    }

    public raise(sender: TSender, eventArgs: TArgs) : void {
        for (let i = 0; i < this._subscriptions.length; i++) {
            this._subscriptions[i](sender, eventArgs);
        }
    }
}

export class TypedSenderEvent<TSender> extends TypedEvent<TSender, EventArgs> {
}

export class Event extends TypedSenderEvent<any>{
}
