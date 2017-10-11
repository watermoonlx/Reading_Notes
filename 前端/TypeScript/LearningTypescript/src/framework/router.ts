import { EventEmitter } from './event_emitter';
import { AppEvent } from './app_event';
import { Route } from './route';


class Router extends EventEmitter implements IRouter{
    private _defaultController: string;
    private _defaultAction: string;

    constructor(
        mediator:IMediator,
        defaultController: string,
        defaultAction:string
    ){
        super(mediator);
        this._defaultAction = defaultAction || "home";
        this._defaultController = defaultController || "index";
    }

    public initialize() {
        $(window).on('hashchange', () => {
            let r = this.getRoute();
            this.onRouteChange(r);
        });

        this.subscribeToEvents([
            new AppEvent('app.initialize', null, (e: any, data?: any) => {
                this.onRouteChange(this.getRoute());
            }),
            new AppEvent('app.route', null, (e: any, data?: any) => {
                this.setRoute(data);
            })
        ])
    }


    private getRoute() {
        let h = window.location.hash;
        return this.parseRoute(h);
    }    

    private parseRoute(hash:string) {
        if (hash[hash.length - 1] === '/') {
            hash = hash.substring(0, hash.length - 1);
        }

        let comp = hash.replace("#", '').split('/');
        let controller = comp[0] || this._defaultController;
        let action = comp[1] || this._defaultAction;

        let args = [];
        for (let i = 2; i < comp.length; i++){
            args.push(comp[i]);
        }

        return new Route(controller, action, args);
    }

    private setRoute(route: Route) {
        let s = route.serialize();
        window.location.hash = s;
    }

    private onRouteChange(route: Route) {
        this.triggerEvent(new AppEvent('app.dispatch', route, null));
    }

}

export { Router };