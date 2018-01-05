function init(msg, respond) {
    console.log('math plugin initialized!');
    console.log('some expensive action.....Done!');
    respond();
}

export function math(options) {
    this.add({ role: 'math', cmd: 'sum' }, (msg, respond) => {
        let sum = msg.left + msg.right;
        respond(null, { answer: sum });
    });

    this.add({ role: 'math', cmd: 'sum', integer: true }, function (msg, respond) {
        this.act({ role: 'math', cmd: 'sum', left: Math.floor(msg.left), right: Math.floor(msg.right) }, respond);
    })

    this.add({ init: 'math' }, init);
}