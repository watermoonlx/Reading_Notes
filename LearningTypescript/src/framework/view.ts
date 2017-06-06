import { EventEmitter } from './event_emitter';
import { AppEvent } from './app_event';

function ViewSettings(templateUrl: string, container: string) {
    return function (target: any) {
        let original = target;

        function construct(constructor, args) {
            let c = function () {
                constructor.apply(this, args);
            }

            c.prototype = constructor.prototype;
            let instance = new c();
            instance._container = container;
            instance._templateUrl = templateUrl;
            return instance;
        }

        function f(...args) {
            return construct(original, args);
        }

        f.prototype = original.prototype;

        return f;
    }
}

class View extends EventEmitter implements IView {
    protected _container: string;
    private _templateUrl: string;

    private _templateDelegate: HandlebarsTemplateDelegate;

    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize() {
        throw new Error('Not Implement');
    }

    public dispose() {
        throw new Error('Not Implement');
    }

    protected bindDomEvents(model: any) {
        throw new Error('Not Implement');
    }

    protected unbindDomEvents(model: any) {
        throw new Error('Not Implements');
    }

    private loadTemplateAsync() {
        return new Promise<string>((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: this._templateUrl,
                dataType: 'text',
                success: (response) => {
                    resolve(response);
                },
                error: (...args: any[]) => {
                    reject(args);
                }
            })
        });
    }

    private compileTemplateAsync(source: string) {
        return new Promise<HandlebarsTemplateDelegate>((resolve, reject) => {
            try {
                this._templateDelegate = Handlebars.compile(source);
                resolve(this._templateDelegate);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    private getTemplateAsync() {
        return new Promise((resolve, reject) => {
            if (!this._templateDelegate) {
                this.loadTemplateAsync()
                    .then(source => {
                        return this.compileTemplateAsync(source);
                    });
            } else {
                return Promise.resolve(this._templateDelegate);
            }
        })
    }

    protected renderAync(model) {
        return new Promise((resolve, reject) => {
            this.getTemplateAsync()
                .then((templateDelegate) => {
                    let html = this._templateDelegate(model);
                    $(this._container).html(html);
                    resolve(model);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

export { ViewSettings, View };