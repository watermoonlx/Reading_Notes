# 第13章 扩展的XMLHttpRequest API

## 13.1 从服务器端获取二进制数据

在HTML5之前，当使用XMLHttpRequest对象从服务器端获取二进制数据时，开发者通常需要通过XMLHttpRequest对象的overrideMimeType方法来重载所获取数据的Mime Type类型，将所获取数据的字符编码（charset）修改为用户自定义类型。

```js
var xhr=new XMLHttpRequest();
xhr.open('GET','test.png',true);
xhr.overrideMimeType('text/plain; charset=x-user-defined');
xhr.onreadystatechange=function(e){
  if(this.readyState===4 && this.status===200){
    var binStr=this.responseText;
    //...
  }
}
```

这样虽然也能获取二进制数据，但XMLHttpRequest对象的responseText属性值并不是原始的二进制数据，而是这些数据组成的一串字符串。

在HTML5中，为XMLHttpRequest对象新增了responseType属性和response属性：

（1）responseType属性

用于指定服务器端返回的数据类型，可以为：

* text
* arrayBuffer
* blob
* json
* document

（2）response属性

依据responseType属性的不同，response属性值类型也不同：

| responseType属性 | response属性            |
| -------------- | --------------------- |
| text           | 字符串                   |
| arrayBuffer    | ArrayBuffer对象         |
| blob           | Blob对象                |
| json           | Json对象                |
| document       | Document对象（代表一个XML文档） |



## 13.2 发送数据

HTML5以前，通常只能通过XMLHttpRequest对象的send方法向服务器端发送字符串或Document对象。

在HTML5中，对XMLHttpRequest对象的send方法进行改善，使其可以发送：

* 字符串
* Document对象
* 表单数据
* Blob对象
* 文件
* ArrayBuffer对象



## 13.3 跨域数据请求

CORS