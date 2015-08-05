var http = require('http'),
    socketIO = require('socket.io'),
    asyncWebSocket = require('../../lib/index');
    
var server = http.createServer(handler),
    io = socketIO(server),
    async = asyncWebSocket.io(null, {debug: true});

io.on('connect', function(socket){
    async.addSocket(socket);
});

async.onRequest('update', function(clientData, req){
    return {
        id: req.id,
        content: clientData,
        type: req.type
    };
});

server.listen(8080);

function handler(req, res){
    res.end('http on ' + req.url);
}