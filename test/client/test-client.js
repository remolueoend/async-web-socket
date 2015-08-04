var socketIO = require('socket.io-client'),
    asyncWebSocket = require('../../lib/index');
    
var io = socketIO('http://localhost:8080'),
    async = asyncWebSocket.AsyncSocketIO(io, {debug: true});

async.request('update', {user: 'remo'}).then(function(res){
    console.log(res);
}, function(err){
    throw err;
}).done();