import { AppEvent } from './app_event';

class EventEmitter implements IEventEmitter{
    protected _metiator: IMediator;
    protected _events: Array<IAppEvent>;

    constructor(metiator: IMediator) {
        this._metiator = metiator;
    }

    public triggerEvent(event: IAppEvent) {
        this._metiator.publish(event);
    }

    public subscribeToEvents(events: Array<IAppEvent>) {
        this._events = events;
        events.forEach(i => this._metiator.subscribe(i));
    }

    public unsubscribeToEvents() {
        this._events.forEach(i => this._metiator.unsubscribe(i));
    }
}

export { EventEmitter };