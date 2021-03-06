# Javascript的单线程模型

Javascript的单线程模型，是指Javascript的执行时单线程的，但并不是指Javascript引擎和浏览器本身是单线程的（Javascript引擎和浏览器怎么区别？）。

在浏览器的实现中，Javascript代码的执行和页面的渲染是使用同一个线程。这也就是为什么，Javascript长时间执行的时候，页面会出现卡死的情况。这么设计的原因，是因为Javascript经常会修改DOM，所以用同一个线程来渲染DOM，可以保证在修改完成后立即渲染。这也同时解释了，为什么HTML中`<script>`标记会阻塞页面的渲染。

而浏览器本身还有其他的线程，比如事件监听线程，它专门负责监听浏览器事件。绝大多数浏览器事件都是异步的（asynchronous），包括UI交互事件（比如Click）和I/O事件（比如XHR请求到达）。浏览器事件对应Javascript中全局对象和元素对象上的各个事件，我们可以利用它们来注册事件处理函数。

所谓的非阻塞特性，是指：浏览器是事件驱动的，浏览器对事件的**接收**是非阻塞的！每当一个事件发生，如果该事件绑定了事件处理函数，则立即将一条message加入消息队列中，等待处理（如果事件冒泡，并且父元素也注册了事件处理函数，则会添加相应的message到消息队列中，只是顺序是在子元素的message之后）。此时若消息队列中没有消息，则该条消息立即被处理，即事件处理函数立即执行。但如果消息队列中有消息，则该条消息必须等到前面的消息处理完成后才能得到处理。也即是说，该事件的处理函数不会立即执行，用户不会立即看到期望的响应。但无论哪种情况，浏览器的事件监听线程都没有被阻塞，可以继续监听事件！即便UI看起来卡死了，但浏览器依然在接受着事件，并且持续将message加入消息队列中。

除了事件之外，另一种将函数加入消息队列的方法是使用`setTimeout`函数。`setTimeout`函数可以在指定时间后将函数加入消息队列，但是这个指定时间只是加入消息队列的时间，并不是执行时间！所以不能依靠该函数作为一个精确的定时器来使用。

这种非阻塞特性和C#中的async/await编程模式有异曲同工之妙。浏览器的事件监听线程可看做C#中的主线程，它通过某种方式持续监听浏览器事件（比如轮询）。当事件发生时，它将事件处理函数（如果有）交给另一个线程处理，然后立即返回，继续监听事件。这样保证主线程永远不阻塞。如果通过c#来实现类似的功能，则我们需要创建一个async函数，在函数内部利用await等待事件处理函数的执行。此时主线程可立即返回，继续监听新的事件。伪代码如下：

```cs
public void Main(){

    //先创建一个消息队列，再创建一个无限循环的异步任务，利用一个线程轮询消息队列，如果有消息，就执行。

    //事件监听
    while(true){
        if(EventOccurs())
            HandleEvent();
    }
}

private async void HandleEvent(){
    await FindAndAddEventHandlerToAQueue();
    //这里实际上创建了一个新线程来负责查找和把事件处理函数加入一个队列
    //主线程立即返回，保持响应
}
```

由于async函数中，遇到await之后，主线程立即返回，而await后面的任务执行完成之后，主线程又接着从停止点继续执行，我们也就可以得出结论，async函数是对异步执行的任务及其回调函数的封装！也就是async函数体内，应该await异步任务，然后执行回调。可以以同步代码的形式执行回调代码。



