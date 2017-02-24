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

## 从数组、类数组对象、可枚举对象、生成器函数创建Observable

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

## 1.4 Cold vs. Hot Observables

Cold：订阅时才触发执行函数。每个订阅关系是彼此独立，互不影响的。
Hot：无论是否有订阅者，流中已有数据产生。多个订阅者共享流中数据。
<!--后来的订阅者可获取当前最新的数据（带重发功能的Observable/Subject可回放之前的数据）。-->

* Subject：多播，共享流
    * Multicasted Observables： `ConnectableObservable`
        * `.refCount()`：有人订阅则执行，没人订阅自动停止，直到有人订阅。
    * BehaviorSubject： 缓存并可重播当前值的Subject。
    * ReplaySubject：缓存并可重播多个值的Subject。
    * AsyncSubject：只返回最后一个值，且在Completed时返回。


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

# 3. 将Callback转换为Observable流

将回调函数作为最后一个参数的异步编程模式。

## 3.1 将Callback转换为Observable流

`Rx.Observable.fromCallback()`：可用于常见的回调模式，但不适用于NodeJS类型的将error对象作为回调函数第一个参数的回调模式。

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





