[TOC]

# 6.1 同步方法与异步方法

​	在Node中，使用`fs模块`来实现所有有关**文件**及**目录**的**创建**、**写入**及**删除**操作。

​	在`fs模块`中，所有对文件及目录的操作都可以使用**同步**和**异步**两种方法。带Sync后缀的是同步方法，不带的是异步方法。

​	在大多数情况下，都应该使用异步方法。在极少数情况下，如启动服务器时读取配置文件，需要使用同步方法。



# 6.2 对文件执行读写操作

## 6.2.1 文件的完整读写

![读取和写入](./images/readFile_writeFile.png)

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

![open、read和write方法](./images/open_read_write.png)

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

```javascript
fs.mkdir(path,[mode],callback);
```

​	`mode`：创建的目录的权限控制。

​	`callback`：创建失败时的回调。`function(err)`。

### 6.3.2 读取目录

```javascript
fs.readdir(path,callback);
```

​	`callback`：`function(err,files)`。files是一个数组，元素为读取到的所有文件名和目录名。



# 6.4查看与修改文件或目录的信息

### 6.4.1 查询文件或目录的信息

```javascript
fs.stat(path,callback);
fs.lstat(path,callback);//当查看符号链接文件信息时，必须使用lstat。
```

​	`callback`：`function(err,stats:fs.State)`。

​	fs.Stats对象的属性：

| 属性                | 描述                                     |
| ----------------- | -------------------------------------- |
| isFile            |                                        |
| isDirectory       |                                        |
| nlink             | 文件或目录的硬连接数量。                           |
| size              | 文件字节数。                                 |
| atime             | 文件的访问时间。                               |
| mtime             | 文件的修改时间。                               |
| ctime             | 文件的创建时间。                               |
| isBlockDevice     | 用于判断被查看文件是否为一个**块设备文件**。仅UNIX下有效。      |
| isCharacterDevice | 用于判断被查看文件是否为一个**字符设备文件**。仅UNIX下有效。     |
| isSymbolicLink    | 用于判断被查看文件是否为一个**符号链接文件**。仅在lstat方法中有效。 |
| isFIFO            | 用于判断被查看文件是否为一个**FIFO文件**。仅在UNIX下       |
| isSocket          | 用于判断被查看文件是否为一个**socket文件**。仅在UNIX下有效。  |
| ...               | 其他                                     |



### 6.4.2 检查文件或目录是否存在

```javascript
fs.exists(path,callback);
```

​	`callback`：`function(exists:bool)`

### 6.4.3 获取文件或目录的绝对路径

```javascript
fs.realpath(path,[cache],callback);
```

### 6.4.4 修改文件访问时间及修改时间

```javascript
fs.utimes(path,atime,mtime,callback);
```

​	`atime`：指定修改后的访问时间。

​	`mtime`：指定修改后的修改时间。

​	`callback`：修改完成后的回调函数。`function(err)`。



​	若通过`fs.open`方法得到文件描述符，则可使用下面的方法：

```javascript
fs.futimes(fd,atime,mtime,callback);
```

### 6.4.5 修改文件或目录的读写权限

```javascript
fs.chmod(path,mode,callback);
```

![mode](./images/mode.png)



# 6.5 可以对文件或目录执行的其他操作

### 6.5.1 移动文件或目录

```javascript
fs.rename(oldPath,newPath,callback);
```

​	`callback`：`function(err)`。

### 6.5.2 创建与删除文件的硬链接（快捷方式）

​	创建硬链接：

```javascript
fs.link(srcpath,dstpath,callback);//srcpath与dstpath必须位于同一卷中
```

​	删除硬链接：

```javascript
fs.unlink(path,callback);
```

​	创建硬链接后，每一个硬链接都是独立的，原文件也算一个硬链接。删除任何一个都可以。但删除最后一个硬链接，则相当于删除这个文件了。

​	PS：移动文件本质上就是硬链接的创建和原硬链接的删除过程。

