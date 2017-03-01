# 1.创建和订阅简单Observable流

## 1.1 从头创建

```javascript
var sourceStream=Rx.Observable.create(observer=>{

    //执行所需操作，在合适的时候调用onNext()，在结束的时候调用onCompleted()，在错误的时候调用onError()
    observer.onNext(42);
    observer.onCompleted();

    //返回一个函数，用于在取消订阅时，终止执行函数，并进行必要的释放操作。
    return function(){
        //dispose操作
    }
});

var subscription=sourceStream.subscribe(
    x=>{//获取下一个数据时的操作},
    e=>{//出错时的操作},
    ()=>{//流结束时的操作}
);

subscription.dispose();//取消订阅，终止执行函数
```

## 1.2 从简单序列创建Observable

```javascript
var sourceStream=Rx.Observable.range(1,5);
```

## 1.3 使用timer创建Observable

```javascript
var sourceStream=Rx.Observable.timer(
    5000,//延迟5秒开始
    1000//每隔1秒返回一个数据
).timeStamp()//为返回数据加上时间戳属性;

//{value:0,timestamp:12312313}
//{value:1,timestamp:23424234}
```

## 1.4 从数组、类数组对象、可枚举对象、生成器函数创建Observable

```javascript
//Array
var array=[1,2,3,4,5];
var sourceStream1=Rx.Observable.from(array);

//Array-Like
var arrayLike={length:5};
var sourceStream2=Rx.Observable.from(arrayLike);

//Iterable
var set=new Set([1,2,3,4,5]);
var sourceStream3=Rx.Observable.from(set);

var map=new Map([['key1',1],['key2',2]]);
var sourceStream4=Rx.Observable.from(map);

//Generator
function* fibonacci () {
  var fn1 = 1;
  var fn2 = 1;
  while (1){
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}

var sourceStream5=Rx.Observable.from(fibonacci()).take(5);
```

## 1.5 Cold vs. Hot Observables

Cold：订阅时才触发执行函数。每个订阅关系是彼此独立，互不影响的。
Hot：无论是否有订阅者，流中已有数据产生。多个订阅者共享流中数据。
<!--后来的订阅者可获取当前最新的数据（带重发功能的Observable/Subject可回放之前的数据）。-->

* Subject：多播，共享流
    * Multicasted Observables： `ConnectableObservable`
        * `.refCount()`：有人订阅则执行，没人订阅自动停止，直到有人订阅。
    * BehaviorSubject： 缓存并可重播当前值的Subject。
    * ReplaySubject：缓存并可重播多个值的Subject。
    * AsyncSubject：只返回最后一个值，且在Completed时返回。


***



# 2. 从事件到Observable

RxJS提供了工厂方法，用以将DOM和NodeJS中的异步事件转换为Observable流，流中数据为事件相关消息。

RxJS并不打算取代现有的异步编程模型，比如promise和callback。但是，当我们想对事件流进行过滤、映射、组合等操作时（即对触发的事件，在真正处理之前，进行一些预处理），RxJS便提供了极大的便利。

## 2.1 将DOM事件转换为Observable流

`Rx.Observable.fromEvent(元素对象, '事件名');`

```javascript
//单个元素的事件
var result = document.getElementById('result');

var source = Rx.Observable.fromEvent(document, 'mousemove');

var subscription = source.subscribe(e => result.innerHTML = e.clientX + ', ' + e.clientY);

//多个元素的事件
var result = document.getElementById('result');
var sources = document.querySelectorAll('div');

var source = Rx.Observable.fromEvent(sources, 'click');

var subscription = source.subscribe(e => result.innerHTML = e.clientX + ', ' + e.clientY);
```

除了原生的事件，RxJS也支持jQuery、AngularJS等多个库的事件转换。也可将`Rx.config.useNativeEvents`属性置为true来只使用原生事件。

## 2.2 将NodeJS事件转换为Observable流

`Rx.Observable.fromEvent(eventEmitter, '事件名')`

```javascript
var Rx = require('rx'),
  EventEmitter = require('events').EventEmitter;

var eventEmitter = new EventEmitter();

var source = Rx.Observable.fromEvent(eventEmitter, 'data')

var subscription = source.subscribe(data => console.log('data: ' + data));

eventEmitter.emit('data', 'foo');
```

## 2.3 利用`FromEventPattern`将自定义事件转换为Observable流

```javascript
var $tbody = $('#dataTable tbody');

var source = Rx.Observable.fromEventPattern(
  function addHandler (h) { $tbody.on('click', 'tr', h); },//定义如何订阅事件，参数h代表事件处理程序，在调用该函数时由RxJS提供。
  function delHandler (h) { $tbody.off('click', 'tr', h); }//定义如何取消订阅
  );

var subscription = source.subscribe(e => alert($( e.target ).text()));
```

delHandler函数也支持额外的一个参数，用以处理那种，订阅时返回一个对象，用于取消，的情况。

***



# 3. 从Callback到Observable

将回调函数作为最后一个参数的异步编程模式。

## 3.1 将Callback转换为Observable流

对通过回调来响应的异步方法进行包装，包装函数将返回一个Observable。

`Rx.Observable.fromCallback()`：可用于常见的回调模式，但不适用于NodeJS类型的将error对象作为回调函数第一个参数的回调模式。

```javascript
var Rx = require('rx'),
    fs = require('fs');

// Wrap the exists method
var exists = Rx.Observable.fromCallback(fs.exists);

var source = exists('file.txt');

// Get the first argument only which is true/false
var subscription = source.subscribe(
    x => console.log('onNext: %s', x),
    e => console.log('onError: %s', e),
    () => console.log('onCompleted'));
```

`Rx.Observable.fromNodeCallback()`：专用于NodeJS类型的回调模式。

## 3.2 将Observable流转换为Callback

要求Observable流只能返回一个值。

```javascript
//RxJS本身未提供，需自定义一个方法
Rx.Observable.prototype.toCallback = cb => {
  var source = this;
  return () => {
    var val, hasVal = false;
    source.subscribe(
      x=> { hasVal = true; val = x; },
      e => throw e, // Default error handling
      () => hasVal && cb(val)}
    );
  };
};
```

***



# 4.从Promise到Observable

Promise的缺点：
1. 只能返回单个值。
2. 不能取消。
3. 不能对多个Promise进行合并操作。

RxJS库原生支持Promise，一些Observable的实例方法，可以直接由Promise去调用。但返回值都是Observable流。即可以把Promise视为一个只返回一个值的Observable。（应该不能subscribe）

## 4.1 将Promise转换为Observable流

`Rx.Observable.fromPromise()`：要求参数是一个符合ES6标准的Promise。

## 4.2 将Observable流转换为Promise

`Rx.Observable.prototype.toPromise()`

***



# 5. Generator和Observable

## 5.1 Async/Await Style and RxJS

`Rx.Observable.spawn()`:参数为一个Generator函数。

包装需要按顺序进行的多个异步操作，使之可以以同步的方式书写。也就是说，这个方法实际上就是Async/Await模式的一种实现。

```javascript
var Rx = require('rx');

var thunk = function (val) {
  return function (cb) {
    cb(null, val);
  };
};

var spawned = Rx.Observable.spawn(function* () {
  var v = yield thunk(12);//兼容多种异步模式，由RxJS将值取出并返回。
  var w = yield [24];
  var x = yield Rx.Observable.just(42);
  var y = yield Rx.Observable.just(56);
  var z = yield Promise.resolve(78);
  return v + w[0] + x + y + z;
});

spawned.subscribe(
  function (x) { console.log('next %s', x); },
  function (e) { console.log('error %s', e); },
  function () { console.log('completed'); }
);

// => next 212
// => completed
```

## 5.2 Mixing Operators with Generators

RxJS中的许多Operator也支持Generator。可将Generator函数的返回值视为一个Observable。

```javascript
function* fibonacci(){
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    yield current;
  }
}

Rx.Observable.from(fibonacci())
  .take(10)
  .subscribe(function (x) {
    console.log('Value: %s', x);
  });

//=> Value: 1
//=> Value: 1
//=> Value: 2
//=> Value: 3
//=> Value: 5
//=> Value: 8
//=> Value: 13
//=> Value: 21
//=> Value: 34
//=> Value: 55
```

***



# 6. 查询Observable流

## 6.1 组合不同的流

``Rx.Observable.prototype.merge()`：组合两个流。流中数据的发送顺序没有保障。两个流同时被激活。

`Rx.Observable.prototype.concat()`：按**顺序**组合两个流。只有当第一个流中数据发送完毕，第二个流的数据才开始发送。只有第一个流触发了completed事件，第二个流才被激活。

`Rx.Observable.prototype.catch()`：按**顺序**组合两个流。若第一个流完成发送，并且没有产生任何错误，则第二个流不会被激活。

`Rx.Observable.prototype.onErrorResumeNext()`：按**顺序**组合两个流。即便第一个流由于出错而不能完成发送，第二个流也会被激活。

`Rx.Observable.zip(...args, [resultSelector])`：第一个参数为多个Observable，第二个参数为结果筛选函数。等每一个Observable返回值后，将这些值作为参数传递给第二个参数处理。返回值一个Observable，数据为第二个函数的返回值。

## 6.2 投射

`Rx.Observable.prototype.map()/select()`

`Rx.Observable.prototype.flatMap()/selectMany()`：无顺序保障

`Rx.Observable.prototype.concatMap()/selectConcat()`：有顺序保障

## 6.3 过滤

`Rx.Observable.prototype.filter()`

## 6.4 基于时间的操作

通过缓存来达到基于时间操作Observable流。

`Rx.Observable.prototype.bufferWithCount()`：缓存指定数量的值。当缓存满后，一次性以Array的形式推送所有缓存数据。

`Rx.Observable.prototype.bufferWithTime()`：在指定时间内缓存所有值。当时间到后，一次性以Array的形式推送所有缓存数据。

[参考资料：分类的操作符](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md)

***



# 7. 错误处理

## 7.1 错误捕捉--`catch`

***静态方法***：
`Rx.Observable.catch(...args)`：参数为多个Observable或Observable数组。按顺序激活Observable，若由于异常而导致停止，则激活下一个Observable。函数返回值为另一个Observable，其数据为参数中的Observable最终成功获取的值。

```javascript
var source = Rx.Observable.catch(
  get('url1'),
  get('url2'),
  get('url3'),
  getCachedVersion()
);

var subscription = source.subscribe(
  function (data) {
    // Display the data as it comes in
  }
);
```

***实例方法***：
`Rx.Observable.prototype.catch(Observable|Function)`：参数为另一个Observable或错误处理函数。若当前Observable实例出错，则启用备份Observable，或调用错误处理函数。错误处理函数也返回一个Observable。

```javascript
var source = get('url1').catch(getCachedVersion());

var subscription = source.subscribe(
  function (data) {
    // Display the data as it comes in
  }
);
```

## 7.2 忽略错误--`onErrorResumeNext`

***静态方法***：
`Rx.Observable.onErrorResumeNext(...args)`：按顺序执行多个Observable，若其中一个出错，则忽略，继续执行下一个。返回为另一个Observable。

***实例方法***
`Rx.Observable.prototype.onErrorResumeNext(second:Observable|Promise)`：按顺序执行当前Observable和第二个Observable。若当前Observable发送错误，则忽略，继续执行第二个。

>PS：`catch`是若执行正确，则不会执行后面的。`onErrorResumeNext`则是，一定会执行所有Observable，无论其中的Observable是否出错。

## 7.3 重试Observable--`retry()` & `retryWhen()`

`Rx.Observable.prototype.retry(n:number)`：若出错，则重试。参数为重试次数。返回值为另一个Observable。

```javascript
var source = get('url').retry(3);

var subscription = source.subscribe(
  function (data) {
    console.log(data);
  },
  function (err) {
    console.log(err);
  }
);
```
`Rx.Observable.prototype.retryWhen(notifier)`：在指定条件下重试。参数notifier是一个函数，该函数的参数是一个Observable，其数据为Observable实例中触发的error。notifier函数的主体，是处理这个Observable并返回一个新的“重试标记”Observable。这样，当error流新数据时，重试标记Observable会得到相应通知。若重试标记Observable也产生一个新的值，则重启。若抛出异常，则整个流抛出异常。若完成，则整个流完成。

```javascript
var source = Rx.Observable.interval(1000)
    .map(function(n) {
        if(n === 2) {
            throw 'ex';
        }
        return n;
    })
    .retryWhen(function(errors) {
        return errors.delay(200);//返回一个新的Observable，用于产生重试标记。这里重试标记总是延迟200ms发出。从而实现过200ms再重试。
    })
    .take(6);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
    
    
var source = get('url').retryWhen(
  function (attempts) {
    return attempts
      .zip(Rx.Observable.range(1, 3), function (_, i) { return i })
      .flatMap(function (i) {
        console.log('delay retry by ' + i + ' second(s)');
        return Rx.Observable.timer(i * 1000);//逐渐增大重试等待时间，重试3次。
      });
  }
);

var subscription = source.subscribe(
  function (data) {
    // Displays the data from the URL or cached data
    console.log(data);
  }
);
// => delay retry by 1 second(s)
// => delay retry by 2 second(s)
// => Data
```

## 7.4 确保资源释放--`finally`

`Rx.Observable.prototype.finally()`

更优雅的方式：使用Disposable来封装需要释放的资源，使用using来调用：

```javascript
//封装需要释放的资源
function DisposableWebSocket(url, protocol) {
  var socket = new WebSocket(url, protocol);

  // Create a way to close the WebSocket upon completion
  var d = Rx.Disposable.create(function () {
    socket.close();
  });

  d.socket = socket;

  return d;
}

var source = Rx.Observable.using(
  function () { return new DisposableWebSocket('ws://someurl', 'xmpp'); },
  function (d) {
    return Rx.Observable.from(data)
      .tap(function (data) { d.socket.send(data); });//每次调用就不要手动释放了
  }
);

var subscription = source.subscribe();
```

## 7.5 延迟合并的Observable中的错误--`mergeDelayError`

`Rx.Observable.mergeDelayError(...observables)`：合并多个observable到一个observable（类似于mergeAll），并且将流中产生的错误放到最后再触发。即正常的流都completed之后，再出发。
***

# 8.Observable流结合Transducers使用

在Observable流上使用[transducer.js](https://github.com/cognitect-labs/transducers-js)类库。

# 9.背压

如何处理源Observable流产生数据的速度大于operator或observer能够处理的速度？

Cold Observable：只有当有订阅者时才产生数据。
Hot Observable：在订阅之前，其数据就已经在产生。Observable以自己的频率产生数据，不管下游能否处理。典型：事件流。

## 9.1 有损背压

通过抛弃一些数据，来匹配生产和消费速度。

### Debounce
`Rx.Observable.prototype.debounce()`：在间隔指定之间内源流没有新数据产生时，才取源流上一次产生的最后一个数据作为下一个数据。

### Throttling
`Rx.Observable.prototype.throttle()`：在指定间隔时间内，取源流第一个产生的数据作为下一个数据。

### Sample
`Rx.Observable.prototype.sample()`：在指定间隔时间（不能传number了？），去源流中产生的上一个数据。如果间隔时间小于源流创建数据的时间，则除了第一次采样，此后几次不会产生数据。

### Pausable
`Rx.Observable.prototype..pausable()`：使Observable可暂停，不再产生数据，丢弃在暂停过程中产生的数据。注意不应该用在cold observable上，因为调用resume继续产生数据时，cold observable会重启整个执行函数。

```javascript
var pausable = getSomeObservableSource()
  .pausable();

pausable.subscribeOnNext(function (data) {
  console.log('Data: %o', data);
});

pausable.pause();//暂停

// Resume in five seconds
setTimeout(function () {
  pausable.resume();//继续
}, 5000);
```

## 9.2 有损背压

### Buffers and Windows

`Rx.Observable.prototype.bufferWithCount(count, [skip])`：缓存指定数量的数据，然后作为一个Array发送。skip指定开始下一个缓存的间隔数。

`Rx.Observable.prototype.bufferWithTime(timeSpan, [timeShift | scheduler], [scheduler])`

`Rx.Observable.prototype.bufferWithTimeOrCount(timeSpan, count, [scheduler])`

### Pausable Buffers

`Rx.Observable.prototype.pausableBuffered(pauser)`：与pausable方法类似。区别是，在暂停期间会缓存新到达的数据，而不是丢弃。再重新开始之后，依次返回这些数据。

### Controlled Observables

`Rx.Observable.prototype.controlled([enableQueue])`：缓存所有数据，在主动调用request时才发送数据。

```javascript
var source = Rx.Observable.range(0, 10).controlled();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

source.request(2);

// => Next: 0
// => Next: 1
```



http://www.introtorx.com/content/v1.0.10621.0/15_SchedulingAndThreading.html























