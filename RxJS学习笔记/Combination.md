[TOC]
## merge

***实例方法，Observable.prototype.merge***
***静态方法，Observable.merge***

将**多个**Observable序列组合为一个Observable序列。
![merge](http://reactivex.io/rxjs/img/merge.png)

可通过参数控制合成时同时监听的Observable数量。即先监听一部分，等发送完毕，再监听一部分，每一次监听只能是指定并发数量的Observable。当并发数量限制为1时，实际上相当于`concat`。

***

## mergeAll

***实例方法，Observable.prototype.mergeAll***

将**一个**高阶Observable序列转换为一阶Observable。
![mergeAll](http://reactivex.io/rxjs/img/mergeAll.png)

```javascript
var clicks = Rx.Observable.fromEvent(document, 'click');
var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
var firstOrder = higherOrder.mergeAll();
firstOrder.subscribe(x => console.log(x));
```

***

## mergeMap

***实例方法，Observable.prototype.mergeMap***

将一个Observable序列map为多个Observable序列，然后将这些序列merge，形成一个一阶Observable。

或

将一个Observalbe序列map为一个高阶Observable序列，然后执行mergeAll。

![merge](http://reactivex.io/rxjs/img/mergeMap.png)

***

## mergeMapTo

***实例方法：Observable.prototype.mergeMapTo***

类似于`mergeMap`，但是每个元素先被Map为一个固定的Observable序列。mergeMap和mergeMapTo的关系就等于map和MapTo的关系。

***

## mergeScan

***实例方法：Observable.prototype.mergeScan***
先执行scan操作。scan操作内的函数返回一个Observable，该Observable内的元素会被自动取出，并作为积累值传入下一个迭代。

用途举例：Http请求方法的返回值通常是一个只包含一个值的Observable。如果我们想scan一个Http方法的返回值，则可用mergeScan来将每次调用的返回值从Observable中取出。
```javascript
const click$ = Rx.Observable.fromEvent(document, 'click');
const one$ = click$.mapTo(1);
const seed = 0;
const count$ = one$.mergeScan((acc, one) => Rx.Observable.of(acc + one), seed);
count$.subscribe(x => console.log(x));

// Results:
1
2
3
4
// ...and so on for each click
```

***

## concat

***实例方法，Observable.prototype.concat***
***静态方法，Observable.concat***

该方法类似于merge，都是将多个Observable压平，成为一个Observable。但区别是，merge没有顺序，而concat，只有当前一个Observable序列发送完毕，才会开始发送下一个Observable的数据。

![merge](http://reactivex.io/rxjs/img/concat.png)

## concatAll

参照mergeAll，只是保持顺序。

## concatMap

参照concatMap，只是保持顺序。

## concatMapTo

参照mergeMapTo，只是保持顺序。

## combineAll

将一个高阶的Observable转换为一个一阶的Observable，当外部的Observable完成后，使用`combineLatest`将产生的Observable组合起来。

> 该Operator的使用场景是，一个Observable序列（A）的元素被map为一个元素为Observable序列的序列（高阶Observable，B）。通过combineAll操作符，可以将这个高阶Observable的元素Observable组合为一个Observable，其组合方式为`combineLatest`。高阶序列B的元素必须是有限的，这可以通过限制序列A有限来实现，也可以通过take来限制B为有限。只有当B元素有限时，需要组合的Observable数量才能确定，进而使用`combineLatest`来进行组合。

```
注意区别`mergeAll`和`combineAll`。
相同点：都是将一个高阶Observable转换为一阶Observable。
不同点：
1. mergeAll转换得到的Observable，其元素就是原来高阶Observable的元素的元素，是单个值。而combineAll转换得到的Observable，其元素是高阶Observable每个元素Observable的元素组成的数组。
2. conbineAll的高阶Observable序列必须是有限的，这样才能确认最终合成的数组元素数量。而mergeAll没有这个要求。
3.combineAll必须等到每个待combine的序列都至少返回一个元素后，才能产生元素数组。mergeAll没有这个要求。

mergeAll是将高阶Observable（即多个一阶Observable序列）压扁合成一个Obseervable，从订阅者的角度看，它就是一个Observable，隐藏掉了多个Observable。而combineAll则是将高阶Observable组合，每次都能看到所有Observable的最近返回数据，并没隐藏多个Observable。
```

```javascript
var clicks = Rx.Observable.fromEvent(document, 'click');//点击事件流
var higherOrder = clicks.map(ev =>
        Rx.Observable.interval(Math.random()*2000).take(3)
    ).take(2);//将每个点击事件映射为一个Observable流，从而构成一个高阶Observable。只取该高阶Observable的前两个元素，从而构成有限序列。
var result = higherOrder.combineAll();
result.subscribe(x => console.log(x));//这里的x是个数组，其成员为对应的组合的Observable的元素。
```

## combineLatest

