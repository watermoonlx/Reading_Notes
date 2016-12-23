[TOC]

# 5.1 创建Buffer对象

​	在Node中，Buffer类是一个可以在任何模块中使用的***全局类***，***不需要引入任何模块***。

​	Buffer类有三种构造函数：

### （1）只指定缓存区大小（以字节为单位）

```javascript
new Buffer(size);
```

​	被创建的Buffer对象有一个length属性，属性值为缓存区大小。

​	可以使用fill方法填充缓存：

```javascript
buf.fill(value,[offset],[end]);
```

* 第一个参数为填充值；
* 第二个参数指定写入起始位置。可选参数，默认为0，即从头写入。
* 第三个参数指定写入终止位置。可选参数，默认为缓存区大小。

### （2）使用一个数组来初始化缓存区

```javascript
new Buffer(array);
```

### （3）使用一个字符串来初始化缓存区

```javascript
new Buffer(str,[encoding])
```



# 5.2 字符串的长度与缓存区的长度

​	一个字符串的长度与根据该字符串所创建的缓存区的长度并不相同。因为在计算字符串的长度时，以***文字***作为一个单位，而在计算缓存区的长度时，以***字节***作为一个单位。通过序号访问buffer数组的时候，返回的也是字节，而非文字。

​	字符串是“不可变”的。但是buffer数组是可以通过赋值来改变元素值的！！！

​	buffer数组没有`indexOf`,  `match`, `search` , `replace`,  `substring`等方法。但有`slice`方法，用于取出指定位置的数据。注意，JS中字符串的`slice`方法返回的是一个子数组。而buffer数组的`slice`方法，返回的就是原始数据组成的数组。修改该数组，也会修改原buffer数组中的数据！！！

```javascript
buf.slice(start[,end])
```



# 5.3 `Buffer`对象与字符串对象的相互转换

### （1）Buffer对象的toString方法

```javascript
buf.toString([encoding],[start],[end])
```

* 第一个参数用于指定编码格式，默认为utf8。
* 第二个、第三个参数用于指定起始位置和终止位置。

### （2）Buffer对象的write方法

​	向一个已经创建的Buffer对象中写入字符串：

```javascript
buf.write(string,[offset],[length],[encoding]);
```

* 第二个、第三个参数用于指定写入Buffer的位置。从1+offset个字节开始，到offset+length个字节为止。

### （3）StringDecoder对象

​	类似于`toString`，但是对utf8数据提供更好的支持。

​	使用前需要加载`string_decoder`模块。

```javascript
var StringDecoder=require('string_decoder').StringDecoder;
var decoder=new StringDecoder([encoding]);
```

​	该对象的`write`方法，可用来将Buffer对象转换成字符串。其主要优点是，可用于处理分割存储于多个Buffer中的数据。用它输出的字符串，可以保证没有乱码。它会利用内部的缓存，来暂时存储不能解码的字节。

```javascript
decoder.write(buf1);
decoder.write(buf2);
```


# 5.4 Buffer对象与数值对象之间的相互转换

​	JavaScript中只有Number对象。但在一些场合还是需要精确指定数字类型。Node中为Buffer对象提供了将二进制数据转换为JS中的Number类型、以及将Number类型转化为精确的数字类型后再写入Buffer对象的方法。

​	Buffer对象的read系列方法用于将Buffer对象中的数据读取出来，并转换为JS中的Number类型后输出。write系列方法用于将JS中的Number类型数据转化为精确数据类型后再写入Buffer对象。

![Buffer对象与Number对象](./images/Buffer与Number.png)



# 5.5 Buffer对象与JSON对象之间的相互转换

​	可通过JSON.stringify方法将Buffer对象转换成一个JSON字符串（由内部二进制数据组成的数组）。

```javascript
JSON.stringify(buf);
```

​	可通过JSON.parse方法将一个转换为字符串的数组还原为数组对象。

```javascript
JSON.parse(json);
```

​	注意这里只是还原为数组，如果还要还原为Buffer对象，则还需要新建一个Buffer对象。

```javascript
let copy=new Buffer(JSON.parse(json));
```



# 5.6 复制缓存数据

```javascript
buf.copy(targetBuffer,[targetStart],[sourceStart],[sourceEnd]);
```



# 5.7 Buffer类的类方法（静态方法）

### （1）`isBuffer`

​	判断一个对象是否为一个Buffer对象。

```javascript
Buffer.isBuffer(obj);
```

### （2） `byteLength`

​	计算一个指定字符串的字节数。

```javascript
Buffer.byteLength(string,[encoding]);
```

### （3） `concat`

​	将几个Buffer对象结合创建一个新的Buffer对象。

```javascript
Buffer.concat(list,[totalLength]);
```

### （4） `isEncoding`

​	检测一个字符串是否为一个有效的编码格式字符串。

```javascript
Buffer.isEncoding(encodingString);
```

