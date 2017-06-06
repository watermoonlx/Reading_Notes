import { EventEmitter } from './event_emitter';
import { AppEvent } from './app_event';
import { Controller } from './controller';

class Dispatcher extends EventEmitter implements IDispatcher {
    private _controllersHashMap: Map<string, IController>;
    private _currentController: IController;
    private _currentControllerName: string;

    constructor(
        mediator: IMediator,
        controllers: IControllerDetails[]
    ) {
        super(mediator);
        this._controllersHashMap = this.registerController(controllers);
        this._currentController = null;
        this._currentControllerName = null;
    }

    public initialize() {
        this.subscribeToEvents([
            new AppEvent('app.dispatch', null, (e, data?) => {
                this.dispatch(data);
            })
        ]);
    }

    private registerController(controllers: IControllerDetails[]): Map<string, IController> {
        let hashMap = new Map<string, IController>();
        let l = controllers.length;

        if (l <= 0) {
            this.triggerEvent(new AppEvent(
                'app.error',
                'Cannot create an application without at least one controller.',
                null
            ));
        }

        controllers.forEach(i => {
            let name = i.controllerName;
            let hashMapEntry = hashMap[name];
            if (hashMapEntry) {
                this.triggerEvent(new AppEvent(
                    'app.error',
                    'Two controller cannot use the same name.',
                    null
                ));
            }
            hashMap[name] = i.controller;
        });

        return hashMap;
    }

    private dispatch(route: IRoute) {
        let controller = this._controllersHashMap[route.controllerName];

        if (controller) {
            let controller: IController = new Controller(this._metiator);

            let a = controller[route.actionName];
            if (a) {
                if (this._currentController == null) {
                    this._currentControllerName = route.controllerName;
                    this._currentController = controller;
                    this._currentController.initialize();
                } else {
                    if (this._currentControllerName !== route.controllerName) {
                        this._currentController.dispose();
                        this._currentControllerName = route.controllerName;
                        this._currentController = controller;
                        this._currentController.initialize();
                    }
                }
            } else {
                this.triggerEvent(new AppEvent(
                'app.error',
                `Action not found in controller: ${route.controllerName} + ${route.actionName}`,
                null
            ));
            }
        } else {
            this.triggerEvent(new AppEvent(
                'app.error',
                `Controller not found: ${route.controllerName}`,
                null
            ));
        }
    }
}

export { Dispatcher };