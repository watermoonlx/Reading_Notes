# 5.1 认识SSH

## SSH是什么

* SSH：Secure Shell 安全外壳协议
* 建立在应用层基础上的安全协议
* 可靠，专为远程登录会话和其他网络服务提供安全性协议
  
## 服务器安装SSH服务

* 安装SSH：`yum install openssh-server`
* 启动SSH：`service sshd start`
* 设置开机运行：`chkconfig sshd on`

PS: 以服务器版本安装的CentOS，已经默认安装了SSH服务。