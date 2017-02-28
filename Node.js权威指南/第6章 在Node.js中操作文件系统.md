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
| nlink             | 文件的硬连接数量。                              |
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

### 6.5.2 创建与删除文件的硬链接

​	

[理解 Linux 的硬链接与软链接]: http://www.ibm.com/developerworks/cn/linux/l-cn-hardandsymb-links/#fig2

![](./images/Hard_Soft_Link.jpg)

​	硬链接相当于文件别名，软链接相当于快捷方式。软链接文件的内容是指向的文件的路径。

​	创建硬链接：

```javascript
fs.link(srcpath,dstpath,callback);//srcpath与dstpath必须位于同一卷中，不可为目录创建硬链接。
```

​	删除硬链接：

```javascript
fs.unlink(path,callback);
```

​	创建硬链接后，每一个硬链接都是独立的，原文件也算一个硬链接。删除任何一个都可以。但删除最后一个硬链接，则相当于删除这个文件了。

​	PS：移动文件本质上就是硬链接的创建和原硬链接的删除过程。

### 6.5.3 创建与查看符号链接（软链接）

​	创建软链接：

```javascript
fs.symlink(srcpath,dstpath,[type],callback);
```

​	`type`：'file'|'dir'|'junction '

​	读取软链接中包含的另一个文件或目录的路径：

```javascript
fs.readlink(path,callback);
```

### 6.5.4 截断文件

 	截断文件：先清除文件内容，然后修改文件尺寸。

```javascript
fs.truncate(filename,len,callback);
fs.truncate(fd,len,callback);//先fs.open
```

### 6.5.5 删除空目录

```javascript
fs.rmdir(path,callback);
```

### 6.5.6 监视文件或目录

#### （1）监视文件

```javascript
fs.watchFile(filename,[options],listener);
```

​	`options`：是一个对象。

​			persistent：bool，当指定了呗监视的文件后是否保持正在运行的应用程序。默认为true。

​			interval：每个多少毫秒检查一次文件是否变化。

​	`listener`：`function(curr,prev)`。参数类型都是fs.Status类。

​	取消监视：

```javascript
fs.unwatchFile(filename,[listener]);
```

#### （2）监视文件或目录

```javascript
var watcher=fs.watch(filename,[option],[listener]);
```

​	`listener`：`function(event,filename)`。

​		event：'rename'|'change'。`rename`包括重命名、移动也删除。`change`是文件内容发生变化。

​		watcher是一个`fs.FSWatcher`对象，它拥有一个`close`方法，用于停止监视。

​	filename：文件或目录必须已存在。

​	另一种使用方法：

```javascript
var fs=require('fs');
var watcher=fs.watch('./message.txt');
watcher.on('change',function(event,filename)){
  	console.log(event);
	console.log(filename);
}
```



# 6.6 使用文件流

### 6.6.1 流的基本概念



# 6.7 对路径进行操作（path模块）

​	`path`模块提供了处理与转换路径的方法及属性。

#### (1) `normalize`方法

​	将非标准路径字符串标准化。

#### (2) `join`方法

​	将多个参数值字符串结合为一个路径字符串。

```javascript
path.join([path1],[path2],[...]);
```

#### (3) `resolve`方法

​	以应用程序根目录为起点，根据所有的参数值字符串解析出一个绝对路径。

```javascript
path.resolve(path1,[path2],[...]);
```

#### (4) `relative`方法

​	获取两个路径之间的相对关系。

```javascript
path.relative(from,to);
```

#### (5) `dirname`方法

​	获取一个路径中的目录名。

#### (6) `basename`方法

​	获取一个路径中的文件名。

#### (7) `extname`方法

​	获取一个路径中的扩展名。

#### (8) `path.sep`属性

​	当前操作系统的文件分隔符。

#### (9) `path.delimiter`属性

​	当前操作系统的路径分隔符。

​	Windows中为“;”，UNIX中为“:”。



