- [第3章 主机规划与磁盘分区](#第3章-主机规划与磁盘分区)

# 第3章 主机规划与磁盘分区

1.各个组件或设备在Linux下都是一个文件。

2.各硬件设备在Linux下的文件名

| 设备                 | 文件名           |
| ------------------ | ------------- |
| IDE硬盘              | /dev/hdp[a-d] |
| SCSI/SATA/USB硬盘/U盘 | /dev/sd[a-p]  |
。。。

硬盘分区之后，各个分区的文件名是原文件名加数字，如：/dev/sda1,/dev/sda2……。1，2，3，4四个号码只能给主分区或扩展分区使用，逻辑分区从5开始。

**3.磁盘的组成**

磁盘可以细分出扇区和柱面两种单位。每个扇区为512byte。

磁盘的第一个扇区主要记录了两个重要信息：

* 主引导分区（Master Boot Record，MBR）：可以安装引导加载程序的地方，有446Byte。
* 分区表（partion table）：记录整块硬盘分区的状态，有64bytes。

**4.磁盘分区表**

在分区表所在的64bytes容量中，总共分为四组记录区，每组记录区记录了该区段的起始于结束的柱面号码。（从1开始，不包括0。0是第一个扇区。）

* 所谓“磁盘分区”就是对64byte的分区表进行设置。
* 硬盘默认的分区表仅能写入四组分区信息。这四组分区信息称为主分区（或者扩展分区，扩展分区最多有一个）。
* 分区的最小单位为柱面。
* 逻辑分区是由扩展分区持续切割出来的分区。
* 能够被格式化后作为数据访问的分区为主分区和逻辑分区。扩展分区无法格式化。

**5.开机流程与主引导分区（MBR）**

BIOS---->MBR，引导加载程序---->加载内核文件

* BIOS：基本输入输出系统。由主板提供。
* 引导加载程序（Boot loader）：操作系统安装时安装到MBR中的程序。其提供的功能有：
  * 提供菜单，让用户可以选择不同的开机选项。（多系统）
  * 载入内核文件：直接指向可开机的程序区段来开始操作系统。
  * 转交其他loader：将引导加载功能转交给其他loader负责。

计算机可能具有两个以上的引导加载程序。引导加载程序除了可以安装在MBR外，还可以安装在每个分区的引导扇区内。

* 每个分区都拥有自己的启动扇区
* 实际可开机的内核文件是放置在各个分区内的。
* loader只会认识自己的系统分区内的可开机内核文件，以及其他loader而已（？）。

**6.为什么装多系统时，最好先装windows？**

因为Windows安装时会直接覆盖MBR。而Linux安装时，可以选择将boot loader安装到MBR还是个别分区的启动扇区。

**7.目录树与文件系统**

Linux中所有的数据都是以文件的形态来呈现，形成一个目录树结构。根目录的表示方法为一条斜线“/”，其他所有文件都是由根目录衍生而来，如：/home/dmtsai/mydata。

**8.格式化**

格式化（高级格式化）又称逻辑格式化，它是指根据用户选定的文件系统（Windows：FAT16，FAT32，NTFS等，Linux：EXT2，EXT3，EXT4等），在磁盘的特定区域写入特定数据，在分区中划出一片用于存放文件分配表、目录表等用于文件管理的磁盘空间。

**9.挂载**

所谓“**挂载**”就是利用一个目录当成进入点，将某**磁盘分区**的数据放置在该目录下；也就是说，进入该目录就可以读取该分区。

几乎所有的目录（除了个别目录），都可以作为挂载点。

* 必须分区
  * / ：根分区
  * swap分区：交换分区（虚拟内存），内存较小时，推荐为内存2倍。内存较大时，比内存大2GB。没有挂载点。
* 推荐分区
  * /boot：启动分区，200MB。其他目录占满了，也不影响系统启动。



