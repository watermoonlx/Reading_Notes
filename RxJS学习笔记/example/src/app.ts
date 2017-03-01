import * as Rx from 'rxjs/Rx';

let arr = [];

for (let i = 0; i < 1000; i++){
    arr.push(i);
}

let timeStart = Date.now();

Rx.Observable.from(arr,Rx.Scheduler.asap).subscribe(
    () => { },
    () => { },
    () => {
        console.log(`Total time: ${Date.now()-timeStart}ms`)
    }
)

console.log('All done!');
