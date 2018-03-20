# 第14章 使用Web Workers处理线程

## 14.1 基础知识

用途：将耗费时间比较长的（CPU密集型）工作交给后台线程完成。

注意：后台线程不可修改访问UI，即不可使用window对象或document对象。



创建Workder：

```js
var worker=new Worker('worker.js');
```

通过监听worker对象的onmessage事件，来从后台线程获取消息：

```js
worker.onmessage=function(event){
  event.data;
}
```

通过worker对象的postMessage方法，来向后台线程发送消息：

```js
worder.postMessage(message);//只能发送字符串
```



在后台线程中，通过onmessage事件来监听从主线程发送而来的消息：

```js
onmessage=function(event){
  event.data;
}
```

通过postMessage方法来向主线程发送消息：

```js
postMessage(result);
```



## 14.2 与线程进行数据的交互



## 14.3 线程嵌套

线程中还可以嵌套子线程，从而把一个较大的后台线程切分为几个子线程，在每个子线程中各自完成相对独立的一部分工作。

### 14.3.1 单层嵌套

在后台线程中，再创建一个子线程的方法，与在主线程中创建后台线程的方法一样。注意向子线程发送数据是调用worker.postMessage()方法。而向主线程返回数据，是直接调用postMessage()函数。

### 14.3.2 在多个子线程中进行数据交互

通过父线程中转。



## 14.4 线程中可用的变量、函数和类



## 14.6 Shared Worker

### 14.6.1 基础知识

HTML5提供了一种叫做SharedWorker的Worker，它可以在多个页面之间共享。

创建SharedWorker：

```js
var worker=new SharedWorker(url,[name])
```

* 第一个参数用于指定后台脚本文件的URL地址
* 第二个参数为可选参数，用于指定Worker的名称

当开发者创建多个SharedWorker时，若一个或两个参数都相同，则公用线程，不创建新的线程。

