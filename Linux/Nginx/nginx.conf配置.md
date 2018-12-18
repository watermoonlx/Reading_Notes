- [`nginx.conf`文件结构](#nginxconf文件结构)
    - [全局块](#全局块)
    - [events块](#events块)
    - [http块](#http块)
    - [server块](#server块)
    - [location块](#location块)
- [指令说明](#指令说明)
    - [user user [group]](#user-user-group)
    - [worker_processes number | auto](#worker_processes-number--auto)
    - [pid file](#pid-file)
    - [error_log file](#error_log-file)
    - [incloud file](#incloud-file)
    - [accept_mutex on | off](#accept_mutex-on--off)
    - [accept_accept on | off](#accept_accept-on--off)
    - [use method](#use-method)
    - [woker_connections number](#woker_connections-number)
    - [default_type mime-type](#default_type-mime-type)
    - [access_log path[format[buffer=size]]](#access_log-pathformatbuffersize)
    - [sendfile on | off](#sendfile-on--off)
    - [sendfile_max_chunk size](#sendfile_max_chunk-size)
    - [keepalive_timeout timeout[header_timeout]](#keepalive_timeout-timeoutheader_timeout)
    - [keepalive_requests number](#keepalive_requests-number)
    - [listen address[:port][default_server][setfib=number][backlog=number][rcvbuf=size][sndbuf=size][deferred]](#listen-addressportdefault_serversetfibnumberbacklognumberrcvbufsizesndbufsizedeferred)
    - [server_name name…](#server_name-name)
    - [location [ = | ~ | ~* | ^~ ] url](#location----------url)
    - [root path](#root-path)
    - [alias path](#alias-path)
    - [index file …](#index-file-)
    - [error_page code … [=[response]] url](#error_page-code--response-url)
    - [allow address | CIDR | all](#allow-address--cidr--all)
    - [auth_basic string | off](#auth_basic-string--off)
    - [auth_basic_user_file file](#auth_basic_user_file-file)

# `nginx.conf`文件结构

```shell
...                 #全局块

event{              #events块
    ...
}

http{               #http块

    server{         #server块
        ...         #server全局块

        location{   #location块
            ...
        }

        location{   #location块
            ...
        }
    }

    server{         #server块
        ...
    }
    ...             #http全局块
}
```

## 全局块
* 说明：全局块是默认配置文件从开始到events块之间的一部分内容，主要是设置一些影响Nginx服务器整体运行的配置指令。因此，这些指令的作用域是Nginx服务器全局。
* 作用：配置Ngnix服务器的用户组、worker process数、Nginx进程PID存放路径、日志的存放路径和类型已经配置文件引入等。

## events块
* 说明：events块的指令主要影响Nginx服务器与用户的网络链接。 
* 作用：是否开启多worker process下的网络连接进行序列化，是否允许同时接收多个网络连接，选取那种事件驱动模型处连接请求，每个worker process可以同时支持的最大连接数等。

## http块
* 说明：http块是Nginx服务器配置中的重要部分，代理、缓存和日志定义等绝大多数的功能和第三方模块的配置都可以放在这模块中。
* 作用：文件引入、MIME-Type定义、日志自定义、是否使用sendfile传输文件、连接超时时间、单连接请求数上限等。

## server块
* 说明：虚拟主机（虚拟服务器）。
* 作用：使得Nginx服务器可以在同一台服务器上至运行一组Nginx进程，就可以运行多个网站。

## location块
* 说明：location块是server块的一个指令。
* 作用：基于Nginx服务器接收到的请求字符串，虚拟主机名称（ip，域名）、url匹配，对特定请求进行处理。

# 指令说明

```shell
#### 全局块 开始 ####
user nobody nobody;                 #配置允许运行nginx服务器的用户和用户组
worker_processes 3;                 #配置允许nginx进程生产的worker process数
error_log logs/error.log;           #配置nginx服务器运行对错误日志存放路径
pid nginx.pid;                      #配置nginx服务器运行时的pid文件存放路径和名称
#### 全局块 结束 ####

#### events块 开始 ####
events
{
    ues epoll;                      #配置事件驱动模型
    worker_connections 1024;        #配置最大连接数
}
#### events块 结束 ####

#### http块 开始 ####
http
{
    include mime.types;             #定义MIME-Type
    default_type application/octet-stream;   
    sendfile on；                   #配置允许使用sendfile方式传输
    keepalive_timeout 65;           #配置连接超时时间
    log_format access.log '$remote_addr-[$time_local]-"$request"-"$http_user_agent"';     #配置请求处理日志的格式

    #### server块 开始 ####
    ##配置虚拟主机 myServerl
    server
    {
        listen  8081;              #配置监听端口和主机名称
        server_name myServer1;

        access_log  /myweb/server1/logaccess.log;#配置请求处理日志存放路径
        error_page 404  /404.html;     #配置错误页面

        location  /server1/location1 { #配置处理／server1/location1 请求的location
            root  /myweb;
            index index.svr1-loc1.htm;
        }

        location  /server1/location2 { #配置处理／server1/location2 请求的location
            root  /myweb;
            index index.svr1-loc2.htm;
        }
    }

    server
    {
        listen  8082;
        server_name  192.168.1.3;
        access_log  /myweb/server2/log/access.log;
        error_log  404  /404.html;    #对错误页面404.html 做了定向配置
        location  /server2/location1 
        {
            root  /myweb;
            index index.svr2-loc1.htm;
        }

        location  /svr2/loc2 
        {
            alias  /myweb/server2/location2;       #对location的URL进行更改
            index index.svr2-loc1.htm;
        }

        location = ／404.html                  #配置错误页面转向
        {
            root  /myweb/;
            index 404.html;
        }
    }
    #### server块 结束 ####
}
### http块 结束 ####
```

## user user [group]
用于配置允许Nginx服务器用户（组）。
user,指可以运行Nginx服务器的用户。
group，指可以运行Nginx服务器的用户组。
通常设置：user nobody nobody

## worker_processes number | auto
Nginx服务器实现并发处理服务关键，设置值越大并发处理量也就越多，但也受到软硬件制约。
number,指Nginx进程最多可以产生worker process数。
auto,Nginx进程自动检测。
默认设置为1。

## pid file
Nginx进程作为系统的守护进程运行，我们需要在某文件中保存当前运行程序的主进程号。Nginx支持对它的存放路径进行自定义配置，指令时pid。
如pid sbin／web_nginx

## error_log file
配置错误日志存放路径，全局块、http块和server块中都可以对日志进行相关配置。
如：error_log logs/error.log error

## incloud file
配置文件的引入，引入其他Nginx配置或者第三方模块的配置。
如：include mime.types

## accept_mutex on | off
设置网络连接的序列化，当某一个时刻只有一个网络连接来时，多个睡眠进程会被同时叫醒，但只有一个进程能接。如果每次呼醒的进程数目太多，会影响一部分系统性能。为了解决这个问题，Nginx配置accept_mutex，当开启的时候，对Nginx进程接收连接进行序列化，防止多个进程对连接的争强。只能在events块配置。

## accept_accept on | off
设置是否允许同时接收多个网络连接，这个是配置worker process是否允许同时接收多个连接。

## use method
事件驱动模型选择，强制Nginx服务器选择那种事件驱动模型进行消息处理。
method:select、poll、kqueue、epoll、rtsig、／dev／poll 以及eventport。
此指令只能在events块中配置。

## woker_connections number
配置最大连接数，设置允许每一个worker process同时开启的最大连接数。
默认为512。
只能在events块中配置。

## default_type mime-type
在浏览器中，显示内容HTML、XML、GIF和Flash等种类繁多的文本、媒体等资源，浏览器为了区分这些资源，需要使用MIME Type。MIME Type是网络资源的媒体类型。Nginx服务器作为Web服务器，必须能够识别前端请求的资源类型。
配置如：include mime.types; 
default_type application/octet-stream;
在http块、server块或者location块进行配置。

## access_log path[format[buffer=size]]
服务日志定义，此处定义所指日志与常规的不同，记录Nginx服务器提供服务过程应答前端请求的日志。可以对服务日志进行格式定义。
配置如：log_format exampleLog ‘remoteaddr−[remoteaddr−[time_local] requestrequeststatus bodybytessentbodybytessenthttp_referer $http_user_agent’
输出：192.168.1.102 - [31/Oct/2011:20:41:29 +0800] “GET/HTTP/1.1” 200 151 “-” “Mozilla/5.0(compatible;MSIE 10.0;Window NT 6.2; Trident/6.0)”

## sendfile on | off
配置允许sendfile方式传输文件，在Apache、lighttd等Web服务器配置中，都有和sendfile相关的配置。用于开启或者关闭sendfile传输文件。默认为off。在http块、server块或者location块进行配置。

## sendfile_max_chunk size
worker process每次调用sendfile传输的数据量最大不能超过这个值。默认为0。在http块、server块或location块中配置。和sendfile指令一起使用。

## keepalive_timeout timeout[header_timeout]
配置连接超时时间，与用户建立会话连接后，Nginx服务器保持这些连接打开一段时间。此指令设置时间。
timeout,服务器端对连接的保持时间。默认值为75s。
header_tiemout,可选项，在应答报文头部Keep-Alive域设置超时时间。该指令被Mozilla或者Konqueror识别。
配置如：keepalive_timeout 120s 100s;
此指令在http块、server块或location块中配置。

## keepalive_requests number
单连接请求数上限，用户端和服务端建立连接后，用于限制用户通过某一连接向Nginx服务器发送请求的次数。
在server块和location块中，默认设置100。

## listen address[:port][default_server][setfib=number][backlog=number][rcvbuf=size][sndbuf=size][deferred]
配置监听使用指令listen。
address,IP地址，如果有IPv6的地址，需要使用中括号“[]”括起来，比如[fe80::1]等
port,端口号，如果只定义IP地址没有定义端口号，就使用80端口。
path，socket文件路径，如／var/run/nginx.sock等
default_server，标识符，将此虚拟主机设置为address:port的默认主机。
配置如：listen :80 | :8000;
listen 192.168.1.10:8000;
listen 192.168.1.10;
listen 8000;
listen 192.168.1.10 default_server backlog=1024;

## server_name name…
基于名称的虚拟主机配置，主机指server块虚拟主机。设置主机名称并配置好DNS，用户就可以使用这个名词向此虚拟主机请求了。
配置如：server_name myserver.com www.myserver.com

## location [ = | ~ | ~* | ^~ ] url
配置location，匹配成功，就继续执行下面命令。
”=”,用于标准url前,要求请求字符串与url严格匹配。
”～”,用于表示URL包含正则表达式，并且区分大小写。
”～*”,用于表示url包含正则表达式，并且不区分大小写。
”^~”,用于标准url前，用于匹配请求最高location后，立即使用localtion处理请求。

## root path
配置请求的根目录，在服务端指定目录中请求资源。

## alias path
更改location的URL，使用alias指令改变location接收的URL的请求路径。
配置如：alias ／locationtest1/other／$1

## index file …
设置网站的默认首页，用于index设置为默认首页。
配置如：index index.$1.html index.my.html index.html

## error_page code … [=[response]] url
设置网站的错误页面，如果服务端错误需要错误页面来显示。这个设置错误页面。
配置如：error_page 404 404/html

## allow address | CIDR | all
基于IP配置Nginx的访问权限，通过IP来判断客户端是否拥有对Nginx的访问权限。
address，允许访问的客户端的IP，不支持同时设置多个。需要重复使用allow指令。
CIDR，允许访问的客户端CIDR地址，例如202.80.18.23/25。
all，代表允许所有客户端访问。
配置如：deny 192.168.1.1；
allow 192.168.1.0/24 
deny all；

## auth_basic string | off
基于密码配置Nginx的访问权限，该给予HTTP Basic Authentication协议的认证。该协议是一种HTTP性质的认证办法，需要识别用户名和密码，认证失败的苦户端不拥有访问Nginx服务器权限。

## auth_basic_user_file file
用语设置包含用户名和密码信息的文件路径。
file为密码文件的绝对路径。
file配置如：name1:password1