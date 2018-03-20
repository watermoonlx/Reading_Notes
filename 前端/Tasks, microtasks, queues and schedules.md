# Tasks, microtasks, queues and schedules

## 一个例子

先看下面的JS代码：

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

打印的最终顺序是什么？答：

```
script start
script end
promise1
promise2
setTimeout
```

最终结果应如上图所示。但不同浏览器下的执行结果可能不同。（新版本浏览器应该都如上图所示）



## 为什么是这个顺序？

为了明白这个顺序，你需要了解event loop是如何处理tasks和microtasks的。

每个线程（thread）拥有自己的**event loop**，因此每个web worker都将拥有各自的event loop，从而彼此独立执行，互不干扰。另一方面，所有同源的窗口将共享一个event loop，从而可以同步通信（这是什么意思？每个窗口应该是独立的进程才对吧？）。Event loop会持续不断地执行各个“排队”等待执行的task。**一个Event loop有多个task源**，每个task源会保证各自领域内task的执行顺序（有一些特例，如[IndexedDB](http://w3c.github.io/IndexedDB/#database-access-task-source) ，会定义自己的task源）。但是**浏览器有权决定在每次事件循环中从哪个task源取task**，从而使浏览器可以优先执行性能敏感的任务，如用户输入。

**Tasks**被调度（scheduled ）后，浏览器可以从内部获取到task，放入JavaScript/DOM的世界，并保证它们依次执行。在两个Task执行之间，浏览器可能会重新渲染UI。获取到鼠标点击事件后，若想执行事件回调函数，就需要调度一个Task。另外parsing HTML也需要，还有上面提到的`setTimeout`（也需要调度一个Task来执行）。

`setTiemout`等待一段给定的事件，然后为它的回调函数调度一个新的Task。这就是为什么`setTiemout`打印的输出会在“script end”后面。因为输出“script end”是第一个Task，而`setTimeout`的输出在另一个Task中。

**Microtasks**用于调度那些需要在**当前执行的脚本执行完成后立马执行的任务**，比如响应一大堆动作（actions），或者进行一些异步操作、但又不想耗费资源创建一个新的Task。Microtask队列将**在每个Task执行的末尾、没有其他JS执行时**被处理。在Microtask执行时再添加新的microtask，将被添加到Microtask队列的末尾，并在本次事件循环中被处理。Microtasks包括[*MutationObserver*](https://www.baidu.com/link?url=XhdkSmUoMTQasSkcG3A3LCX_wGAcruGABs7wMyAwzAc8YYuUjML_XFKdfvPjejtC5KHJ-i9OK0VC1qQydNrWDC0epGHkZuUw58gqgMd2lA3&wd=&eqid=8ea9c16d000057c7000000055a780e6f)的回调，以及上面例子中提到的Promise回调。

当一个Promise完结（settles）后，或者它本身就是完结的（，然后在给它指定回调函数），它将把回调加入Microtask队列。这意味着即便Promise已经完结，它的回调也是（相对于当前正在执行的代码）异步执行的。因此，在一个已经完结的Promise上调用`.then(yey, nay`将立即向MicroTask队列中加入一个新的microtask。这就是为什么上面的例子中，Promise1和Promise2的输出在"script end"后面，原因是必须等到当前执行的脚本完成后microtask才会被处理。而Promise1和Promise2的输出先与`setTimeout`，则是因为microtask是在本次Task事件循环中被执行，不会等到下一个Task。

























