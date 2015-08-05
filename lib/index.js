var AsyncSocket = require('./AsyncSocket'),
    AsyncSocketIO = require('./AsyncSocketIO'),
    SocketApi = require('./SocketApi'),
    SocketIOApi = require('./SocketIOApi'),
    customSocketApi = require('./customSocketApi'),
    customAsyncSocket = require('./customAsyncSocket');

// Build the export object:

var exp = customAsyncSocket;
exp.io = AsyncSocketIO;
exp.base = AsyncSocket;
exp.api = customSocketApi;
exp.api.io = SocketIOApi;
exp.api.base = SocketApi;

module.exports = exp;