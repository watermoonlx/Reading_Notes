[TOC]

# 4.1 核心模块与文件模块

​	一个Node.js应用程序由大量的模块组成，每一个模块都是一个JavaScript脚本文件。



# 4.2 从模块外部访问模块内的成员

## 4.2.1使用`export`对象

## 4.2.2 将模块定义为类

## 4.2.3 为模块定义类变量或类函数



# 4.3 组织与管理模块

## 4.3.1 从node_modules目录中加载模块

​	如果在require函数中只使用文件名，但是不指定路径，则Node.js将该文件视为node_modules目录下的一个文件。

```javascript
require('bar.js')
```

## 4.3.2 使用目录来管理模块

* 在应用程序根目录下创建node_modules目录；
* 在应用程序更目录下创建package.json文件；

## 4.3.3从全局目录中加载模块

​	如果你在操作系统的环境变量中设置了`NODE_PATH`变量，并将变量值设置为一个有效的磁盘目录，则当你在require函数中只指定模块名，而没有指定模块文件的路径，并且Node从其他路径中寻找不到需要被加载的模块文件时，Node将从`NODE_PATH`变量值所指向的磁盘目录中寻找并加载该模块文件。



# 4.4 模块对象`module`的属性

| 属性                | 说明                                       |
| :---------------- | :--------------------------------------- |
| `module.id`       | 当前模块的ID。默认情况下，主模块的ID属性值为“.”,其他模块的ID属性值为该模块文件的绝对路径。在模块文件中可以修改当前模块。 |
| `module.filename` | 当前模块文件的绝对路径文件名。                          |
| `module.loaded`   | 模块是否加载。                                  |
| `module.parent`   | 当前模块的父模块，即调用当前模块的模块对象。                   |
| `module.children` | 当前模块的所有子模块。是一个数组，存放当前模块加载的所有子模块对象。       |



# 4.5 包与npm包管理工具

## 4.5.1 Node.js中的包

​	Node通过包来对一组具有相互依赖关系的模块进行统一的管理。通过包，我们将某个独立的功能封装起来。

​	在Node中，一个包事实上是一个目录，其中包含了用于对包进行描述的JSON格式的package.json文件。

# 4.5.2 npm包管理工具

| 命令                         | 说明               |
| -------------------------- | ---------------- |
| npmsearch <name>           |                  |
| npmview <name>             | 查看package.json文件 |
| npm install <name>         |                  |
| npm install -g <name>      |                  |
| npm root -g                | 查看全局安装的路径        |
| npmconfig set prefix "..." | 设置全局安装的路径        |
| npmlist                    | 查询当前目录下安装的所有包    |
| npmlist -g                 |                  |
| npm uninstall <name>       |                  |
| npm uninstall -g <name>    |                  |
| npm update <name>          |                  |
| npm update -g <name>       |                  |
| npm update                 |                  |
| npm update -g              |                  |
|                            |                  |
|                            |                  |



