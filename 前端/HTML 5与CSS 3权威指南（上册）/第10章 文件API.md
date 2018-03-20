[TOC]

# 第10章 文件API

* 用于读取文件内容的**FileReader API**。
* 可以存取受浏览器沙箱保护的文件系统的**FileSystem API**。



## 10.1 FileList对象与file对象

在HTML 5中，通过添加multiple属性，file控件内允许一次性放置多个文件。

file控件的files属性是一个FileList对象，是file对象的列表，代表用户选择的所有文件。

若只选择了一个文件，则通过files[0]来访问该file对象。



## 10.2 ArrayBuffer对象和ArrayBufferView对象

### 10.2.1 基本概念

目的：高效处理二进制数据。

>JS里的Array，因为有很多功能，而且是不限制类型的，或者它还可能是稀疏的……总之这个Array>是“托管”的，它内部有比较复杂的实现。
>
>而如果你从XHR、File API、Canvas等等各种地方，读取了一大串字节流，如果用JS里的Array去存，又浪费，又低效。
>
>于是为了配合这些新的API增强JS的二进制处理能力，就有了ArrayBuffer。
>
>ArrayBuffer简单说是一片内存，但是你不能（也不方便）直接用它。这就好比你在C里面，malloc一片内存出来，你也会把它转换成unsigned_int32或者int16这些你需要的实际类型的数组/指针来用。这就是JS里的TypedArray的作用，那些Uint32Array也好，Int16Array也好，都是给ArrayBuffer提供了一个“View”，MDN上的原话叫做“Multiple views on the same data”，对它们进行下标读写，最终都会反应到它所建立在的ArrayBuffer之上。除了TypedArray以外，也可以使用DataView来读写ArrayBuffer，这样会麻烦一些，但也更灵活。DataView能更自由的选择字节序，对于对齐的要求也更低。



ArrayBuffer对象代表一个固定长度的用于装载数据的缓存区。

ArrayBufferView对象用于读写ArrayBuffer对象中的内容。

ArrayBuffer对象中的内容只能通过ArrayBufferView对象来读写。ArrayBufferView对象可将缓存区中的数据转换为各种数值类型的数组。



### 10.2.2 ArrayBuffer对象

```javascript
var buf=new ArrayBuffer(32);
```

参数类型是无符号长整数，用于指定缓存区长度，单位byte。在成功创建后，该缓存区内所有数据被初始化为0。

ArrayBuffer对象有一个length属性，代表缓存区长度。



### 10.2.3 ArrayBufferView对象

ArrayBufferView对象以一种准确的格式来表示ArrayBuffer缓存区中的数据。

> `ArrayBufferView` is a helper type representing any of the following JavaScript [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) types:
>
> - [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array),
> - [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array),
> - [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray),
> - [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array),
> - [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array),
> - [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array),
> - [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array),
> - [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array),
> - [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) or
> - [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).
>
> This is a helper type to simplify the specification, it isn't an interface and there are no objects implementing it.

ArrayBufferView是用于简化定义的辅助类型。各种TypedArray才是我们真正使用的类。

```js
var buf=new ArrayBuffer(100);//100 byte

var int32Array=new Int32Array(buf);
int32Array.length; //25，每4个byte被分为一组，对应一个32位整数。
int32Array[10]=15;//此后即可以各组为单位读写缓冲区。

var int8Array=new Int8Array(buf);
int8Array.length;//100，每1个byte被分为一组，对应一个8位整数。
```

创建TypedArray时可选参数：

* byteOffset：数组开始位置与ArrayBuffer缓存区的第一个字节之间的偏移值，单位为字节。必须为数组中单个元素的字节长度的倍数。
* lenth：代表数组中元素的个数。

### 10.2.4 DataView对象

DataView对象有各种get和set方法。

DataView能更自由的选择字节序，对于对齐的要求也更低。



## 10.3 Blob对象

### 10.3.1 Blob对象概述

在HTML5中，新增一个Blob对象，代表原始二进制数据。File对象继承自Blob对象。

> **Blob **对象表示不可变的类似文件对象的原始数据。Blob表示不一定是JavaScript原生形式的数据。[`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 接口基于Blob，继承了 blob的功能并将其扩展使其支持用户系统上的文件。

Blob对象有两个属性：

* size属性表示一个Blob对象的字节长度。
* type属性表示Blob对象的MIME类型。如果是未知类型，则返回一个空字符串。图片类型都以“image/”开头。



### 10.3.2 创建Blob对象

```js
var blob=new Blob([blobParts,type]);
```

构造函数有两个可选参数：

* 第一个参数是一个数组，可以放置任意数量的以下对象：
  * ArrayBuffer对象
  * ArrayBufferView（TypedArray）对象
  * Blob对象
  * String对象
* 第二个参数用于指定被创建的Blob对象的MIME类型。

```js
var blob=new Blob(['1234'+'5678']);
var shorts=new Unit16Array(buffer,512,128);
var blobA=new Blob([blob,shorts]);
```

另外，在HTML5中，通过window.URL对象的createObjectURL方法，可以根据一个Blob对象的二进制数据来创建一个URL地址并返回该地址，当用户访问该URL地址时可以直接下载原始二进制数据。

该功能也可实现“上传照片后，立即预览”的功能。



### 10.3.3 Blob对象的slice方法

Blob对象具有一个slice方法，用于从Blob对象所代表的原始二进制数据中抽离一部分数据，然后将这些数据创建为一个新的Blob对象，其使用方式如下：

```js
var newBlob=blob.slice(start,end,contentType);
```

参数均为可选。若全部省略，则代表复制一个新的Blob对象。



### 10.3.4 在IndexedDB数据库中保存Blob对象



### Blob对象的应用：

* 文件分片上传
* 粘贴图片



## 10.4 FileReader对象

FileReader对象主要用来把文件读入内存，并且读取文件中的数据。

### 10.4.1 FileReader对象的方法

| 方法名                | 参数                       | 描述                                 |
| ------------------ | ------------------------ | ---------------------------------- |
| readAsBinaryString | Blob对象，或继承了Blob对象的file对象 | 将Blob对象或文件中的数据读取为二进制字符串            |
| readAsText         | Blob对象，或继承了Blob对象的file对象 | 将Blob对象或文件中的数据读取为文本数据。             |
| readAsDataUrl      | Blob对象，或继承了Blob对象的file对象 | 将Blob对象或文件中的数据读取为DataUrl（base64编码） |
| readAsArrayBuffer  | Blob对象，或继承了Blob对象的file对象 | 将Blob对象或文件中的数据读取为ArrayBuffer对象     |
| abort              |                          | 中断读取操作                             |

以上方法都是异步的。

### 10.4.2 FileReader对象的事件

| 事件          | 描述            |
| ----------- | ------------- |
| onabort     | 数据读取中断        |
| onerror     | 数据读取出错        |
| onloadstart | 数据读取开始        |
| onprogress  | 数据读取中         |
| onload      | 数据读取成功完成      |
| onloadend   | 数据读取结束，无论成功失败 |

### 10.4.2 使用示例

```js
        function readAsDataURL() {
            const file = fileInput.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert('请确保文件为图像类型');
                return false;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                result.innerHTML = `<img src="${this.result}" />`//注意，这里的this在函数被调用时被动态绑定为了FileReader对象
            }
            reader.onprogress=function(e){
                debugger;
            }
        }
```



ArrayBuffer->ArrayBufferView(Typed Array)->Blob对象->File对象



## 10.5 FileSystem API



## 10.6 Base64编码支持

### 10.6.1 Base64编码概述

Base64编码是一种使用64个可打印字符来表示二进制数据的一种编码方式。

编码后的数据比原始数据略长。

（通常数据解析是应用层协议来规定的。而很多应用层协议要求所有消息都要以可打印的ASCII码字符来传输。所以在传输二进制数据时，需要先将二进制数据编码为可打印的ASCII码）



### 10.6.2 在HTML5中支持Base64编码

#### 1.btoa方法和atob方法

* window.btoa()：将一串字符串进行Base64编码处理
* window.atob()：解码







