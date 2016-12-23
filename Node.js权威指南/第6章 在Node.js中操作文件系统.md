# 6.1 同步方法与异步方法

​	在Node中，使用`fs模块`来实现所有有关**文件**及**目录**的**创建**、**写入**及**删除**操作。

​	在`fs模块`中，所有对文件及目录的操作都可以使用**同步**和**异步**两种方法。带Sync后缀的是同步方法，不带的是异步方法。

​	在大多数情况下，都应该使用异步方法。在极少数情况下，如启动服务器时读取配置文件，需要使用同步方法。



# 6.2 对文件执行读写操作

## 6.2.1 文件的完整读写

### （1）异步读

```javascript
fs.readFile(filename,[options],callback);
```

​	`filename`：指定读取文件的完整路径及文件名。

​	`options`：可选参数。是一个对象（或字符串），用来指定读取文件时需要使用的选项。

​		          flag属性指定对文件采取操作，默认是"r"。

​                          encoding属性指定使用何种编码读取该文件。

​	`callback`：回调函数。`function(err,data)`。第一个参数是操作失败时的错误对象。第二个参数是读取到的文件内容。如果指定了option的encoding属性，则为转换后的字符串。如果未指定，则为一个存放了文件中原始二进制内容的***缓存对象***。

### （2）同步读

```javascript
var data=fs.readFileSync(filename,[options]);
```

### （3）异步写

```javascript
fs.writeFile(filename,data,[options],callback);
```

 	`options`：

​		flag：默认“w”，如果文件已存在，则将删除该文件并新建。“a”，若已存在，则追加。

​		mode：指定当文件被打开时对该文件的读写权限。

​		encoding：用何种编码将字符串写入文件。

​	`data`：字符串或Buffer对象。

### （4）同步写

```javascript
fs.writeFileSync(filename,data,[options]);
```

### （5）追加写入

```javascript
fs.appendFile(filename,data,[options],callback);
fs.appendFileSync(filename,data,[options]);
```



## 6.2.2 从指定位置处开始读写文件

![open、read和write方法](./open_read_write.png)

### （1）open方法

```javascript
fs.open(filename,flags,[mode],callback);
```

​	`callback`：`function(err,fd)`。第二个参数为一个整数值，代表打开文件时返回的文件描述符（Windows中成为文件句柄）。

```javascript
var fd=fs.openSync(filename,flags,[mode]);
```

### （2）read方法

​	使用open方法获得文件描述符后，可用read方法从指定位置读取文件内容。

```javascript
fs.read(fd,buffer,offset,length,position,callback);
```

​	`fd`：文件描述符。

​	`buffer`：指定读取的文件内容放入那个Buffer对象。

​	`offset`：指定往Buffer对象中写入数据时的起始位置。

​	`length`：从文件中读取的字节数。

​	`position`：从文件中读取时的开始位置。

​	`callback`：`function(err,byteRead,buffer)`

### （3）write方法

```javascript
fs.write(fd,buffer,offset,length,position,callback);
```

​	`callback`:`function(err,written,buffer)`



# 6.3 创建与读取目录

### 6.3.1 创建目录

