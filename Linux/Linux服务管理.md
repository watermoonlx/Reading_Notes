- [1. 简介与分类](#1-简介与分类)
    - [1.1 系统的运行级别](#11-系统的运行级别)
    - [1.2 服务的分类](#12-服务的分类)
    - [1.3 服务与端口](#13-服务与端口)
- [2. RPM包服务管理](#2-rpm包服务管理)
    - [2.1 独立的服务管理](#21-独立的服务管理)
    - [2.2. 基于xinetd服务的管理](#22-基于xinetd服务的管理)
- [3. 源码包服务管理](#3-源码包服务管理)
- [4. 服务管理总结](#4-服务管理总结)
- [chkconfig:运行级别 启动顺序 关闭顺序](#chkconfig运行级别-启动顺序-关闭顺序)
- [description: 描述](#description-描述)
# 1. 简介与分类

## 1.1 系统的运行级别

| 运行级别 | 含义                                                        |
| -------- | ----------------------------------------------------------- |
| 0        | 关机                                                        |
| 1        | 单用户模式。可以想象为windows的安全模式，主要用于系统修复。 |
| 2        | 不完全的命令行模式，不含NFS服务。                           |
| 3        | 完全命令行模式，就是标准字符界面                            |
| 4        | 系统保留                                                    |
| 5        | 图形模式                                                    |
| 6        | 重启动                                                      |

* `runlevel`：查看当前运行级别。
    * 通常情况下，显示两个字符：`N 3`。第一个字符代表前一个级别，后一个字符代表当前级别。`N`代表没有级别。即一开机就进入3级别。

* `init 级别`：修改运行级别。

* 修改系统默认运行级别：修改`/etc/inittab`文件，可控制系统开机后直接进入那个运行级别。
    * CentOS 7已不适用。

## 1.2 服务的分类

服务的分类：
* Linux服务
    * RPM包默认安装的服务
        * 独立的服务
        * 基于xinetd的服务（xinetd是一种超级守护进程。它代理访问其他服务。优点：节约系统资源。缺点：效率低。目前已基本淘汰。）
    * 源码包安装的服务

PS：RPM包安装的服务和源码包安装的服务管理上有不同之处。但本质上并没有什么不同，都是Linux服务。可以通过一些配置让两者的管理方式一致。
主要是两者安装位置不同
* RPM包服务安装在默认位置。
* 源码包服务安装在指定位置，一般是`/usr/local/`。

服务启动与自启动：
* 服务启动：在当前系统中让服务运行。
* 服务自启动：让服务在系统开机或重启之后，随着系统的启动而自动启动。

查询已安装的服务：
* 查看RPM包安装的服务：`chkconfig --list`
    * 该命令查看RPM包安装的服务的自启动状态，因此也就可以看到所有RPM包安装的服务。展示的列表是在对应的运行级别下，服务是否自动启动。
* 查看源码包安装的服务：查看服务安装位置，一般是`usr/local/`下

> d是daemon的缩写，说明它自己是个守护进程(daemon) ，它在后台运行，一般都是用来做服务端程序。
mysqld代表是mysql数据库服务的守护进程。

## 1.3 服务与端口

查看系统中目前运行的服务，有两种方式：
* 使用`ps`命令。该命令列出当前运行的所有进程。要区分服务比较困难。
* 查看当前开启的端口。需要了解服务与端口的对应关系。（服务一定会绑定端口么？不一定吧。）

端口是什么？
* 如果把IP地址比作一间房子，端口就是进出这间房子的门。一个IP地址的端口最多有65536个（0-65525）。
* TCP和UDP各自独立，都有65536可以使用。只是有些端口号是公认的，比如80，就是TCP 80。为避免混淆，一般不会再分配给UDP 80。但也有一些服务会同时绑定TCP和UDP上的同一端口号，并提供相同服务，比如DNS。
* `/etc/services`文件列出了常见端口和服务的对应管理。

查看系统中开启的服务：
* `netstat -tulnp`
    * `-t`：列出tcp端口。只有TCP的状态会是Listen。因为需要建立连接。
    * `-u`：列出udp端口
    * `-l`：列出正在监听的网络服务（不包含已经连接的网络服务）
    * `-n`：用端口号显示服务，而不是服务名。
    * `-p`：列出该服务的进程ID（PID）。

# 2. RPM包服务管理

RPM包文件通常的默认安装位置：
* `/etc/`：配置文件位置
* `/etc/init.d/`：启动脚本位置（shell脚本）
    * 是`/etc/rc.d/init.d/`的软链接
* `/etc/sysconfig/`：初始化环境配置文件位置
* `/etc/xinetd.conf`：xinetd配置文件
* `/etc/xinetd.d/`：基于xinetd服务的启动脚本
* `/var/lib/`：服务产生的数据放在这里
* `/var/log/`：日志

启动服务的根本方式，和运行程序一样，是在shell中输入目标程序的绝对路径。

## 2.1 独立的服务管理

独立服务的启动：
* `/etc/init.d/独立服务名 start|stop|status|restart`：运行启动脚本。

* `service 独立服务名 start|stop|restart|status`：上面命令的快捷方式。

独立服务的自启动：
* `chkconfig [--level 运行级别] [独立服务名] [on|off]`
* 修改`/etc/rc.local`或`/etc/rc.d/rc.local`文件。该文件会在Linux启动之后、其余脚本都执行完成后执行。该方式与上面的命令独立，没有关系。不要同时使用。
* 使用`ntsysv`命令管理自启动。和第一种是同一种方法。
* `systemd`：centos 7推荐方式。

## 2.2. 基于xinetd服务的管理

1.安装
CentOS 6之后都默认没有安装xinetd。
`yum install -y xinetd`

2.xinetd服务的启动
所有基于xinetd的服务的启动脚本都放在`etc/xinetd.d/`目录下。修改该目录其启动脚本的配置，然后执行`service xinetd restart`。

3.xinetd服务的自启动
和独立服务自启动类型：
* `chkconfig [独立服务名] [on|off]`
    * 注意，基于xinetd的服务的自启动，不能指定运行级别。基于xinetd的服务的自启动级别就是xinetd服务本身的运行级别。
* 基于xinetd的服务，启动和自启动是绑定的。启动的时候也就自启动了，自启动关闭了那服务也关闭了。
  
# 3. 源码包服务管理

1.源码包服务的启动
* 使用绝对路径，调用启动脚本来启动。不同的源码包的启动脚本不同。可以查看源码包的安装说明，查看启动脚本的方法。
    * 例：`/usr/local/apache2/bin/apachectl start|stop`
  
2.源码包服务的自启动
* 将启动命令写入`/etc/rc.local`。

3.让源码包服务被服务管理命令识别
如何让源码包安装的服务能被service命令管理启动
* 在`/etc/init.d/`目录下创建软链接，链接到源码包启动脚本： `ln -s /usr/local/apache2/bin/apachectl /etc/init.d/aapache`

如何让源码包安装的服务能被`chkconfig`与`ntsysv`命令管理
    1. 在`/etc/init.d/`目录下创建软链接，链接到源码包启动脚本。
    2. 修改启动脚本，在开头增加：
```shell
    # chkconfig:35 86 76                格式是：运行级别 启动顺序 关闭顺序
    # description: ....
```
    3.  执行`chkconfig --add 服务名`


# 4. 服务管理总结

无论以哪种方式安装的服务（rpm、yum、源码包），都有一个启动脚本。这个脚本才是管理服务启动、关闭、重启的根本。通过绝对路径执行这个脚本就可以管理服务。

但是，依据安装方式的不同，这个启动脚本的放置位置不相同。通过rpm和yum安装的服务，其启动脚本通常默认安装在`/etc/init.d/`目录下。而`service`命令就是读取的这个目录。因此通过rpm和yum安装的服务默认就可以通过`service`来管理。通过源码包安装的服务，其启动脚本在用户自己指定的目录中。默认不可以被`service`管理。但只要在`/etc/init.d/`目录下创建一个软链接，指向启动脚本，就可以了。

要设置服务的自启动，通常使用`chkconfig`或`ntsysv`命令。若要让服务可以被这两个命令管理，除了要求服务启动脚本位于`/etc/init.d/`中外，还要求启动脚本中有如下注释内容：

```shell
# chkconfig:运行级别 启动顺序 关闭顺序
# description: 描述
```

对于源码包安装的服务，需要手动添加的上述内容，并执行`chkconfig --add 服务名`命令。

`/etc/rc0.d/`~`/etc/rc6.d/`目录是对应各个运行级别。其中放置着系统在此级别下运行将启动的服务脚本。