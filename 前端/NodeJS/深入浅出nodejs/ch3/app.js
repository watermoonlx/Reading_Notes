var http = require('net');
var server = http.createServer();
server.listen(8888, '127.0.0.1');

server.on('connection', function (socket) {
    console.log(1);
    socket.write('Hello');
});


server.on('connection', function (socket) {
    console.log(2);
    socket.write(' world');
});

