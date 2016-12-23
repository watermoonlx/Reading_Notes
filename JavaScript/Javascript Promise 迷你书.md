# JavaScript Promise迷你书

## 一.什么是Promise

### 1.1 什么是Promise

>Promise是抽象异步处理对象以及对其进行各种操作的组件。

Promise对象是对需要异步处理的任务及其结果的封装，且提供了对异步任务结果进行处理的接口。

### 1.2 Promise简介

ES6中提供的Promise API还不是很多：

* `Constructor`：用于创建Promise对象。
    ```Javascript
    var promise=new Promise(function(resolve,reject)){
        //配置并启动异步任务；
        //在合适的时候（比如成功或失败回调中），调用resolve和reject函数；
    }
    ```
    通常将构造函数封装在工厂方法中，直接return一个new Promise实例。
* 实例方法：
    * `then()`
    * `catch()`
* 静态方法：
    * `Promise.resolve()`
    * `Promise.reject()`
    * `Promise.all()`
    * `Promise.race()`

#### 1.2.1 Promise workflow

创建Promise对象时，其构造函数中的代码即同步执行，异步任务加入异步等待序列。

用then或catch注册的处理方法，必定是以异步方式调用的（即先加入异步等待序列），即便构造函数中的任务以及处理完成并返回结果。

#### 1.2.2 Promise的状态

状态的迁移时不可逆的。

注册的处理函数只会被调用一次。但给一个Promise注册多次处理函数，则即便状态已经是指定状态，但每个处理函数还是会调用。这两点与事件处理函数不同。

## 1.3 编写Promise代码

### 1.3.1 创建Promise对象

流程：

1. `new Promise(function(resolve,reject))`
2. 在function参数中指定异步任务和结果处理：
    * 处理结果正常的话，调用`resolve(处理结果值)`
    * 处理结果错误的话，调用`reject(错误结果值，一般为Error对象)`

### 1.3.2 编写promise对象的处理方法

`then`方法可用来单独注册resolve处理方法或reject处理方法，也可以同时指定resolve和reject处理方法。
`catch`只能用来指定reject处理方法。

推荐分开使用`then`和`catch`，分别注册resolve和reject处理方法。因为这样可以将`catch`作为最后总的错误处理方法，另外`then`中注册的reject处理方法不能捕捉同时注册的resolve方法中抛出的错误。

## 二.实战Promise

### 2.1 `Promise.resolve()`

作用1：创建一个立即resolve的Promise对象，通常用于测试代码。

作用2：将`thenable`对象转换为Promise对象。

`thenable`对象指具有`.then`方法的对象，比如`jQuery.ajax()`方法返回的对象。

### 2.2 `Promise.reject()`

### 2.3 `专栏：Promise的处理方法只能进行异步执行`

Promise创建时内部的任务可以是同步执行的，那么在创建好之后实际上该Promise对象状态就已经确定了。但即使在调用 promise.then 注册回调函数的时候promise对象已经是确定的状态，Promise也会以异步的方式调用该回调函数，这是在Promise设计上的规定方针。因为如果规定可以同步执行的话，那么在不同时候的执行顺序和结果就可能不同。

```Javascript
var promise = new Promise(function (resolve){
    console.log("inner promise"); // 1
    resolve(42);
});
promise.then(function(value){
    console.log(value); // 3
});
console.log("outer promise"); // 2

//inner promise // 1
//outer promise // 2
//42            // 3
```

### 2.4 `then`

#### 2.4.1 Promise chain

```Javascript
function taskA() {
    console.log("Task A");
}
function taskB() {
    console.log("Task B");
}
function onRejected(error) {
    console.log("Catch Error: A or B", error);
}
function finalTask() {
    console.log("Final Task");
}

var promise = Promise.resolve();
promise
    .then(taskA)
    .then(taskB)
    .catch(onRejected)
    .then(finalTask);
```

若想在Promise构造函数或者各延续任务中引发后续的错误处理，有两种方式：
1. 返回一个rejceted状态的Promise对象（在构造函数中调用reject方法，在延续任务中使用Promise.reject静态方法）。
2. 直接throw一个Error对象。

推荐使用第一种方法。

#### 2.4.2 Promise chain中如何传递参数

若想从一个延续任务向另一个延续任务传递数据，直接使用return就行了，该数据会作为参数传递给下一个延续任务的处理函数。（在创建Promise时直接return不能传递数据给处理函数，必须使用resolve()来传递）

```Javascript
function doubleUp(value) {
    return value * 2;
}
function increment(value) {
    return value + 1;
}
function output(value) {
    console.log(value);// => (1 + 1) * 2
}

var promise = Promise.resolve(1);
promise
    .then(increment)
    .then(doubleUp)
    .then(output)
    .catch(function(error){
        // promise chain中出现异常的时候会被调用
        console.error(error);
    });
```

***注意***：每次调用`then()`和`catch()`，不仅仅是注册一个处理函数那么简单，实际上它会返回一个新的Promise对象，其封装的数据是处理函数的结果值，如果为return，则其状态变为resovled，其传递数据则为return的值；如果处理函数throw new Error()，则其状态变为rejected，其传递数据则为Error对象。

### 2.5 `catch()`

### 2.6 专栏：每次调用`then`都会返回一个新创建的promise对象

### 2.7 Promise和数组

### 2.8 Promise.all()

Promise.all()接收一个数组作为参数，数组中的元素都为Promise对象，返回一个新的Promise对象。只有当数组中所有的Promise对象都为resolved时，它才会去调用注册的`.then`方法。而传递给其处理函数的参数，也是一个数组，其元素为各个Promise对象传递的数据。如果其中一个Promise变为Rejected，则立即会调用catch方法注册的处理函数，其参数为这个reject传递的数据！！但并不会取消其他异步任务的执行。如果之后的异步任务再度抛出一个错误，则会提示有异常未捕捉。如果之后的异步任务正常执行，完成之后then也不会被调用。

>Promise.all() is all or nothing，它返回的Promise对象，要么在所有数组中的Promise对象Resovle之后Resolve，要么在数组中任何一个Promise对象Reject时立即Reject。其状态只会变化一次。

### 2.9 Promise.race()

Promise.all()与Promise.all()类似，区别是只要数组中一个Promise元素状态确定了，那么其返回的Promise也立即状态确定。

### 2.10 then or catch()

catch()!

## 三.Promise测试



