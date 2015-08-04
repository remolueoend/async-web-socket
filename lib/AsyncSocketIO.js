var SocketIOApi = require('./SocketIOApi'),
    customAsyncSocket = require('./customAsyncSocket');

/**
 * Specialized version of AsyncSocket for socket.io apps.
 */
module.exports = customAsyncSocket(SocketIOApi);