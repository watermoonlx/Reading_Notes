function repeat(value) {
    return {
        '@@iterator': function () {
            return {
                next: function () {
                    return { done: false, value: value };
                }
            };
        }
    };
}

var RetryWhenObservable = (function (__super__) {
    function createDisposable(state) {
        return {
            isDisposed: false,
            dispose: function () {
                if (!this.isDisposed) {
                    this.isDisposed = true;
                    state.isDisposed = true;
                }
            }
        };
    }

    function RetryWhenObservable(source, notifier) {
        this.source = source;
        this._notifier = notifier;
        __super__.call(this);
    }

    inherits(RetryWhenObservable, __super__);

    RetryWhenObservable.prototype.subscribeCore = function (o) {
        var exceptions = new Subject(),
            notifier = new Subject(),
            handled = this._notifier(exceptions),
            notificationDisposable = handled.subscribe(notifier);

        var e = this.source['@@iterator']();

        var state = { isDisposed: false },
            lastError,
            subscription = new SerialDisposable();
        var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
            if (state.isDisposed) { return; }
            var currentItem = e.next();

            if (currentItem.done) {
                if (lastError) {
                    o.onError(lastError);
                } else {
                    o.onCompleted();
                }
                return;
            }

            // Check if promise
            var currentValue = currentItem.value;
            isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

            var outer = new SingleAssignmentDisposable();
            var inner = new SingleAssignmentDisposable();
            subscription.setDisposable(new BinaryDisposable(inner, outer));
            outer.setDisposable(currentValue.subscribe(
                function (x) { o.onNext(x); },
                function (exn) {
                    inner.setDisposable(notifier.subscribe(recurse, function (ex) {
                        o.onError(ex);
                    }, function () {
                        o.onCompleted();
                    }));

                    exceptions.onNext(exn);
                    outer.dispose();
                },
                function () { o.onCompleted(); }));
        });

        return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
    };

    return RetryWhenObservable;
} (ObservableBase));

observableProto.retryWhen = function (notifier) {
    return new RetryWhenObservable(repeat(this), notifier);
};