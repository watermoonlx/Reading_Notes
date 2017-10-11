var createTodoItem = function (val) {
    var result = document.createElement('LI');
    result.classList.add('list-group-item');
    var innerHTML = "\n    " + val + "\n    <button type=\"button\" class=\"btn btn-default button-remove\" aria-label=\"right Align\">\n      <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">Delete</span>\n    </button>\n  ";
    result.innerHTML = innerHTML;
    return result;
};
var $input = document.querySelector('.todo-val');
var $list = document.querySelector('.list-group');
var $add = document.querySelector('.button-add');
var enter$ = Rx.Observable.fromEvent($input, 'keydown')
    .filter(function (r) { return r.keyCode === 13; });
var clickAdd$ = Rx.Observable.fromEvent($add, 'click');
var input$ = enter$.merge(clickAdd$);
var item$ = input$
    .map(function () { return $input.value; })
    .filter(function (r) { return r !== ''; })
    .map(createTodoItem)
    .observeOn(Rx.Scheduler.asap)
    .do(function (ele) {
    $list.appendChild(ele);
    $input.value = '';
});
var toggle$ = item$.flatMap(function ($todoItem) {
    console.log('toggle:');
    console.log($todoItem);
    return Rx.Observable.fromEvent($todoItem, 'click')
        .filter(function (e) { return e.target === $todoItem; })
        .mapTo($todoItem);
})
    .do(function ($todoItem) {
    if ($todoItem.classList.contains('done')) {
        $todoItem.classList.remove('done');
        console.log("Done!");
    }
    else {
        $todoItem.classList.add('done');
        console.log("Undone!");
    }
});
var remove$ = item$.flatMap(function ($todoItem) {
    console.log('InRemove:');
    console.log($todoItem);
    var $removeButton = $todoItem.querySelector('.button-remove');
    return Rx.Observable.fromEvent($removeButton, 'click')
        .mapTo($todoItem);
})
    .do(function ($todoItem) {
    var $parent = $todoItem.parentNode;
    $parent.removeChild($todoItem);
});
var app$ = toggle$.merge(remove$)
    .do(function (r) { return console.log(r); });
app$.subscribe();
var range$ = Rx.Observable.range(1, 10);
range$.subscribe(function (n) {
    console.log(n);
});
range$.subscribe(function (n) {
    console.log(n);
});
console.log('done!');
