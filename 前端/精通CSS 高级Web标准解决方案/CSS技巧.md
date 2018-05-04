# 利用背景图片来插入图标

```css
a[href="http://www.baidu.com"] {
    background: url(https://www.baidu.com/img/bd_logo1.png?where=super) no-repeat left center;
    background-size: 100px 20px;
    padding-left: 100px;
}
```

要点：

背景图片是从padding-box开始排列的。尽管背景图片默认会弥漫到border-box。

background-size是CSS3才有的属性。

# 子元素浮动导致父元素高度塌陷

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        div{
            border:1px solid red;
        }
        img{
            float: left;
        }
    </style>
</head>

<body>
    <div>
        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1645710608,4064735852&fm=27&gp=0.jpg"
             alt="">
    </div>
</body>

</html>
```

原因：子元素脱离了文档流，导致父元素在计算高度时，高度计算为0。

解决方案：

（1）添加空块级元素或者`<br>`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        div{
            border:1px solid red;
        }
        img{
            float: left;
        }
        .clear{
            clear: both;
            height: 0;
        }
    </style>
</head>

<body>
    <div>
        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1645710608,4064735852&fm=27&gp=0.jpg"
             alt="">
        <p class="clear"></p>
    </div>
</body>

</html>
```

注意，`<br>`是行内元素。理论上clear属性只能作用于块级元素。但是`<br>`例外。

（2）添加`<br>`元素，利用其自身的clear属性

```html
<div>
    <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1645710608,4064735852&fm=27&gp=0.jpg"
         alt="">
    <br clear="all">
</div>
```

（3）利用:after伪类和生成内容

```css
.clear:after{
    content:'';
    display: block;
    clear: both;
}
```

该方法在IE6及以下版本不适用。需要一些hack技巧。

（4）对父元素也进行浮动

由于会改变布局，因此不推荐。

（5）设置父元素的`overflow`属性

将父元素的`overflow`属性设置为auto或者hidden。理论上也可以为scroll，但是scroll会强制出现滚动条。

```css
.clear{
    overflow: auto|hidden;
}
```

 （6）将父元素的`display`设置为table

```css
.clear{
    display: table;
}
```



# 网页渐变背景色

设置背景图片为一个很高且很窄的图片，其颜色从上到下渐变。然后让其在x方向重复。

最后再设置一个背景色，让其余渐变图片最终的颜色一致。

