import { EventEmitter } from './event_emitter';
import { AppEvent } from './app_event';

class Controller extends EventEmitter implements IController {

    constructor(metiator: IMediator) {
        super(metiator);
    }

    public initialize(): void {
        throw new Error('Not implement');
    }

    public dispose(): void {
        throw new Error('Not implement');
    }
}

export { Controller }