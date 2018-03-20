[TOC]

# 第11章 通信API

* 跨文档消息传输功能
* WebSockets API
* Server-Sent Events API




## 11.1 跨文档消息传输

### 11.1.1 跨文档消息传输的基本知识

HTML5提供了在网页文档之间互相接收与发送消息的功能。使用这个功能，只要获取到网页所在窗口对象的实例，不仅同源的Web网页之间可以互相通信，而且可以实现跨域通信。





## 11.2 WebSockets通信

### 11.2.1 WebSockets通信的基本知识

使用WebSockets API可以在服务器与客户端之间建立一个非HTTP的双向连接。这个连接是实时的，也是永久的，除非被显式关闭。

### 11.2.2 使用WebSockets API

**1.建立通信连接**

```js
var webSocket=new WebSocket('ws://localhost:8085/socket');
```

URL字符串必须以“ws”或“wss”文字作为开头。这个URL字符串被设定好之后，在JS脚本中可以通过访问WebScoket对象的url属性来重新获取。

**2.进行双向通信（客户端）**

客户端通过send方法向服务端发送数据：

```js
webSocket.send('text data');
```

只能发送文本数据。但可以把js对象转换为JSON字符串再发送。

客户端事件：

* 通过onmessage事件来接受服务器传过来的数据：

  ```js
  webSocket.onmessage=function(event){
  	var data=event.data;
    	//...
  }
  ```

* 通过onopen事件监听socket打开事件

* 通过onclose事件箭筒socket关闭事件

客户端通过close方法关闭连接。

另外，可以通过读取readState的属性值来获取WebScoket对象的状态：

* CONNECTING（数值为0）：表示正在连接。
* OPEN（数值为1）：表示已建立连接。
* CLOSING（数值为2）：表示正在关闭连接。
* CLOSED（数值为3）：表示已关闭连接。

### 11.2.4 发送对象

转为为JSON字符串。

### 11.2.5 发送与接收原始二进制数据

WebSocket API可以发送和接收ArrayBuffer对象和Blob对象。



## 11.3 Server-Sent Events API

