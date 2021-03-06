[TOC]

# 第1章 Web时代的变迁

## 1.4 HTML 5要解决的三个问题

1. Web浏览器之间的兼容性问题。
2. HTML文档结构不明确。
3. Web应用程序功能受限（浏览器提供的API不多）。




# 第2章 HTML 5 与 HTML 4的区别

## 2.1 语法的改变

### 2.1.1 HTML5的语法变化

在HTML5找那个，围绕着Web标准，重写定义了一套在现有的HTML的基础上修改而来的语法，以便各浏览器在运行HTML时能够符合一个通用的标准。

### 2.1.2 HTML5中的标记方法

#### 1.内容类型（ContentTYpe）

HTML5的文件扩展符与内容类型保持不变。

* 扩展符：.html或.htm
* 内容类型：text/html

#### 2.DOCTYPE声明

DOCTYPE声明是HTML文件中必不可少的。HTML5中声明方法如下：

```html
<!DOCTYPE html>
```

> 现代浏览器包括不同的呈现模式，目的是既支持遵循标准的网页，也支持为老式浏览器而设计的网页。其中， Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks 模式（混杂模式）（也就是宽松呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。另外，注意Mozilla/Netscape 6新增了一种 Almost Standards （近似标准）模式，用于支持为标准的某个老版本而设计的网页。
>
> **什么是 doctype切换**
> ​      放在网页顶部的doctype声明是让浏览器进入正确呈现模式的关键。浏览器自动切换到恰当的呈现模式，以便正确显示由doctype声明所指定的文档种类。
>
> http://blog.csdn.net/taotao6039/article/details/23609507

#### 3.指定字符编码

在HTML5中：

```html
<meta charset="UTF-8">
```

从HTML5开始，对于文件的字符编码推荐使用UTF-8。

### 2.1.3 HTML5确保的兼容性

为了兼容性，允许一些不规范写法。

#### 1.可以省略标记的元素

* 不允许写结束标记的元素有：input，img，br，link…………（<br/>这种形式）
* 可以省略结束标记的元素有：li，dt，dd，p……
* 可以省略全部标记的元素有：html，head，body，tbody……（即使省略，该元素还是隐式存在，可在DOM中访问到）

#### 2.具有boolean值的属性

对于具有boolean值的属性，例如disabled和readonly等，当致谢属性而不指定属性值时，表示true，不写表示false。

也可以将属性名设定为属性值，或者将空字符串设定为属性值，来表示true。

```html
<input type="checkbox" checked>
<input type="checkbox" checked="checked">
<input type="checkbox" checked="">
```

#### 3.省略引号

在指定属性值时，属性值两边加引号时既可以用双引号，也可以用单引号。

HTML5在此基础上做了一些改进，当属性值不包括空字符串、<、>、=、单引号、双引号等字符时，属性值两边的引号可以省略。

```html
<input type="text">
<input type='text'>
<input type=text>
```

### 2.1.4 标记示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"><--! 专门供IE8使用，“以最高级别的可用模式显示内容”-->
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```



## 2.2 新增的元素和废除的元素

### 2.2.1 新增的结构元素

HTML5之前，最常用的结构元素是div。HTML5新增以下结构元素，用来代替div，提供更清晰的语义。

#### （1）section元素

标识页面中的一个内容区块，比如章节、页眉、页脚或者页面中的其他部分。

#### （2）article元素

辨识页面中的一块与上下文不相关的独立内容，比如一篇文章。

#### （3）aside元素

aside表示article元素的内容之外的、与article内容相关的辅助信息。比如侧边栏。

#### （4）header元素

表示一个内容区块或整个页面的标题。

#### （5）footer元素

表示整个页面或者页面中一个内容区块的脚注。

#### （6）nav元素

表示页面中的导航链接。

#### （7）figure元素

表示一段独立的流内容，一般表示文档主体流内容中的一个独立单元（图像、图表、照片、代码等等）。

使用figcaption元素为figure元素添加标题。

#### （8）main元素

表示网页中的主要内容。

### 2.2.2 新增的其他元素

#### （1）video元素

用于定义视频。

```html
<video src="movie.ogg" controls="controls"></video>
```

#### （2）audio元素

用于定义音频。

```html
<audio src="someaudio.wav"></audio>
```

#### （3）embed元素

用来插入各种多媒体，格式可以是Midi、Wav、AIFF、AU、MP3、swf等。比如嵌入flash动画。

```html
<embed src="horse.wav">
```

video、audio、embed以前都要用object元素来实现。

#### （4）mark元素

用来在视觉上向用户呈现那些需要突出显示或高亮显示的文字。典型的，如全局查找时，显示匹配的字符。

#### （5）progress元素

progress表示进度。

#### （6）meter元素

表示度量衡，仅用于已知最大值和最小值的度量。

#### （7）time元素

用于表示时间或日期。这只是一个内联文本标记，效果与span相同。

该元素能够以机器可读的方式对日期和时间进行编码，这样，举例说，用户代理能够把生日提醒或排定的事件添加到用户日程表中，搜索引擎也能够生成更智能的搜索结果。

#### （8）ruby元素

ruby元素用于ruby注释，典型的：中文的拼音。需要配合rt、rp元素使用。

#### （9）rt元素

表示解释或发音。

####（10）rp元素

定义不支持ruby元素的浏览器所显示的内容。

```html
<ruby>
        我<rp>(</rp><rt>wo</rt><rp>)</rp>
        爱<rp>(</rp><rt>ai</rt><rp>)</rp>
        计<rp>(</rp><rt>ji</rt><rp>)</rp>
        算<rp>(</rp><rt>suan</rt><rp>)</rp>
        机<rp>(</rp><rt>ji</rt><rp>)</rp>
</ruby>
```

#### （11）wbr元素

wbr元素表示软换行。wbr与br的区别是：

* br元素表示必须在此处换行。
* wbr元素表示，当浏览器窗口或父级元素的宽度足够时，不进行换行。当宽度不够时，主动在此处进行换行。

#### （12）canvas元素

canvas表示图形。该元素本身没有行为，仅提供一块画布，但把一个绘图API展现给客户端JavaScript，以使脚本能够把想绘制的东西绘制到这块画布上。

```html
<canvas id="myCanvas" width="200" height="200"></canvas>
```

#### （13）command元素

表示命令按钮，比如单选按钮、复选框或按钮。

目前主流浏览器都不支持该元素。

#### （14）details元素

配合summary元素使用。默认只显示标题。用户点击后，显示details信息。

```html
<details>
<summary>Copyright 2011.</summary>
<p>All pages and graphics on this web site are the property of W3School.</p>
</details>
```

目前只有chrome和opera支持该元素。

#### （15）datalist元素

datalist表示可选的列表，与input元素配合使用，可以制作出输入值的下拉列表。

```html
<input list="cars" />
<datalist id="cars">
	<option value="BMW">
	<option value="Ford">
	<option value="Volvo">
</datalist>
```

input中，使用list属性指定关联的datalist。

#### （16）datagrid列表

datagrid表示可选的数据列表，它以树形列表的形式显示。

似乎目前浏览器都不支持这个元素。

#### （17）keygen元素

表示生成密钥。

已废弃！！

#### （18）output元素

表示不同类型的输出，比如脚本的输出。

```html
<form oninput="x.value=parseInt(a.value)+parseInt(b.value)">0
   <input type="range" id="a" value="50">100
   +<input type="number" id="b" value="50">
   =<output name="x" for="a b"></output>
</form> 
```

例中output值为a、b两个input值之和。

#### （19）source元素

用于为媒体元素（如video和audio）定义媒体资源。即需要配合它们使用。

```html
<audio controls>
   <source src="horse.ogg" type="audio/ogg">
   <source src="horse.mp3" type="audio/mpeg">
 Your browser does not support the audio element.
</audio> 
```

#### (20)menu元素

表示菜单列表。

目前所有主流浏览器都不支持。

#### （21）dialog元素

表示对话框。



### 2.2.3 新增的input元素的类型

* email：必须输入e-mail地址的文本输入框。
* url：必须驶入URL地址的文本输入框。
* number：必须输入数值的文本输入框。
* range：必须输入一定范围内数字值得文本输入框。
* Date Pickers：HTML5提供多个可供选取日期和时间的新型输入文本框：
  * date：选取日、月、年。
  * month：选取月、年。
  * week：选取周和年。
  * time：选取时间。
  * datetime：选取时间、日、月、年（UTC时间）。
  * datetime-local：选取时间、日、月、年（本地时间）。



### 2.2.3 废除的元素

#### 1.能使用CSS代替的元素。

#### 2.不再使用frame框架，只支持iframe框架。

#### 3.只有部分浏览器支持的元素。

#### 4.其他



## 2.3 新增的属性和废除的属性

#### 2.3.1 新增的属性

#### 1.表单相关的属性

* autofocus。可以对input（type=text）、select、textarea与button元素指定autofocus属性，使元素在画面打开时自动获得焦点。
* placeholder。可以对input（type=text）和textarea等文本输入框使用。
* form。可以对input（type=text）、output、select、textarea、button、fieldset指定form属性，声明它属于哪个表单，然后可将其放在页面上任何位置，而不是表单内。
* required。可以对input（type=text）和textarea等文本输入框使用。
* ………………………………



map+area元素：带有可点击区域的图像映射。



## 2.4 全局属性

#### 2.4.1 contentEditable属性

是否允许用户标记元素中的内容。

要求元素必须可以获得鼠标焦点。

该属性未指定时，默认从父元素继承。

isContentEditable属性用于标识一个元素是否可编辑。

若要保存修改后的内容，只能通过innerHTML属性获取修改后的html，然后发送到服务端。

#### 2.4.2 designMode属性

用于指定整个页面是否可编辑。

#### 2.4.3 hidden属性

一个布尔属性。用于通知浏览器不渲染该元素，使之处于不可见状态。但是元素中的内容还是被浏览器创建。

#### 2.4.4 spellcheck属性

用于input（type=text）和textarea两个文本输入框，用于指定是否进行拼写和语法检查。

#### 2.4.5 tabindex属性。

每个控件的tabindex表示该控件是第几个被访问到的。



### 2.5 新增的事件





# 第3章 HTML5的结构

### 3.1 新增的主体结构元素

#### 3.1.1 article元素

代表文档、页面或应用程序中独立的、完整的、可以独自被外部引用的内容。

```html
<article>
  <header>
    <h1>标题</h1>
  </header>
  
  <footer>
    
  </footer>
</article>
```

#### 3.1.2 section元素

section元素用来对网站或引用程序中页面上的内容进行分块，一个section元素通常由内容及其标题组成。

可以这样理解：section元素中的内容可以单独存储到数据库中或输出到word文档中。

```html
<article>
  <header>
    <h1>标题</h1>
  </header>
  
  <section>
    <h2>
      红富士
    </h2>
    <p>
      红富士是从普通富士的。。。。。
    </p>
  </section>
  
  <footer>
  </footer>
</article>
```

#### 3.1.3 nav元素

nav元素是一个可以用来作为页面导航的链接组，其中的导航元素链接到其他页面或者当前页面的其他部分。

```html
<nav>
  <ul>
    <li><a href="#HTML5">HTML5</a></aa></li>
    <li><a href="#CSS3">CSS3</a></aa></li>
  </ul>
</nav>
```

#### 3.1.4 aside元素

aside元素用于标识当前页面或文章的附属信息部分。

#### 3.1.5 time元素与微格式

#### 3.1.6 pubdate属性



### 3.2 新增的非主体结构元素



