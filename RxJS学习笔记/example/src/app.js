"use strict";
const Rx = require("rxjs/Rx");
let source1 = Rx.Observable.range(1, 3);
let source2 = Rx.Observable.range(1, 3);
source1.concat(source2)
    .subscribe((x) => console.log(x));
