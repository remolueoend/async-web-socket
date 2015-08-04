var http = require('http'),
    socketIO = require('socket.io'),
    asyncWebSocket = require('../../lib/index');
    
var server = http.createServer(handler),
    io = socketIO(server),
    async = asyncWebSocket.AsyncSocketIO(null, {debug: true});

io.on('connect', function(socket){
    async.addSocket(socket);
});

async.onRequest('update', function(data, req){
    return {
        id: req.id,
        content: data,
        type: req.type
    };
});

server.listen(8080);

function handler(req, res){
    res.end('http on ' + req.url);
}