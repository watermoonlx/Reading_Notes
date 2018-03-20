[TOC]

# 第7章 History API

* 通过脚本实现浏览器历史记录的前后导航。
* 通过脚本在浏览器历史记录中添加项目。
* 在不刷新页面的前提下显示改变浏览器地址栏中的URL。
* 添加了一个当用户点击浏览器的后腿按钮时触发的事件。



## 7.1 History API的基本概念

在HTML5之前，即使采用的是脚本语言的方式，只要浏览器地址栏中的URL地址被切换，都会触发一个页面刷新的过程，这个过程将耗费一些时间与资源。

HTML5的History API允许在不刷新页面的前提下，通过脚本语言的方式来进行页面某块局部内容的更新。



## 7.2 History API使用示例

History API与window.hisotry对象相关。在HTML5之前已存在操作history的方法：

* history.back()
* history.forward()
* history.go()

HTML 5新增：

* history.pushState(state,null,"edit.php")
  * 第一个参数可以为任意对象，用于保存一个在用户点击浏览器后退按钮或前进按钮时可以使用的数据。
  * 第二个参数是一个字符串，用于设置浏览器窗口标题。目前浏览器都不支持，所以是null。
  * 第三个参数可选，代表新页面的相对地址。
* popState事件。用户点击前进或后退时触发。