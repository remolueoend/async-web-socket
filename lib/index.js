var AsyncSocket = require('./AsyncSocket'),
    AsyncSocketIO = require('./AsyncSocketIO'),
    SocketApi = require('./SocketApi'),
    SocketIOApi = require('./SocketIOApi'),
    customSocketApi = require('./customSocketApi'),
    customAsyncSocket = require('./customAsyncSocket');

// Build the export object:
var exp = AsyncSocket;
exp.AsyncSocketIO = AsyncSocketIO;
exp.create = customAsyncSocket;
exp.apis = {
    SocketApi: SocketApi.
    SocketIOApi = SocketIOApi,
    create: customSocketApi
};

module.exports = exp;