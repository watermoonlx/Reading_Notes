import { EventEmitter } from './event_emitter';

function ModelSettings(serviceUrl: string) {
    return function (target: any) {
        let original = target;

        function construct(constructor, args) {
            let c = function () {
                constructor.apply(this, args);
            }

            c.prototype = constructor.prototype;
            let instance = new c();
            instance._serviceUrl = serviceUrl;
            return instance;
        }

        let f: any = function (...args) {
            return construct(original, args);
        }

        f.prototype = original.prototype;

        return f;
    }
}

class Model extends EventEmitter implements IModel {
    private _serviceUrl: string;

    constructor(metiator: IMediator) {
        super(metiator);
    }

    public initialize() {
        throw new Error('Not implement');
    }

    public dispose() {
        throw new Error('Not implement');
    }

    protected requestAsync(method: string, dataType: string, data: any) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: method,
                url: this._serviceUrl,
                data: data || {},
                dataType: dataType,
                success: (response) => {
                    resolve(response);
                },
                error: (...args: any[]) => {
                    reject(args);
                }
            })
        });
    }

    protected getAsync(dataType: string, data: any) {
        return this.requestAsync('GET', dataType, data);
    }

    protected postAsync(dataType: string, data: any) {
        return this.requestAsync('POST', dataType, data);
    }

    protected putAsync(dataType: string, data: any) {
        return this.requestAsync('PUT', dataType, data);
    }

    protected deleteAsync(dataType: string, data: any) {
        return this.requestAsync('DELETE', dataType, data);
    }
}

export { Model, ModelSettings };