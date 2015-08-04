var SocketIOApi = require('./SocketIOApi'),
    customAsyncSocket = require('./customAsyncSocket');

/**
 * Specialized version of AsyncSocket for socket.io apps.
 * 
 * @param {object} serverSocket A socket.io web socket instance.
 */
module.exports = customAsyncSocket(SocketIOApi);