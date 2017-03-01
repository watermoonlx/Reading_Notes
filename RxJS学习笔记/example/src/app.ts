import * as Rx from 'rxjs/Rx';

var source = Rx.Observable.interval(2000)
    .sample(Rx.Observable.interval(500))
    .take(1000);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

console.log('订阅完毕！！');

