var util = require('util'),
    SocketApi = require('./SocketApi');

/**
 * Interface used for socket.io web socket instances.
 * 
 * @param {object} socket The socket.io instance to wrap.
 */
function SocketIOApi(socket){
    if(!(this instanceof SocketIOApi)){
        return new SocketIOApi(socket);
    }
    
    SocketApi.call(this, socket);
}
util.inherits(SocketIOApi, SocketApi);

/**
 * Sends data over the wrapped web socket.
 * 
 * @param {*} data Data to send.
 */
SocketIOApi.prototype.send = function(data){
    this.socket.send(data);
};

/**
 * Registers a listener for incoming messages on the socket.io instance.
 * 
 * @param {function} handler The handler to attach.
 */
SocketIOApi.prototype.onmessage = function(handler){
    this.socket.on('message', handler);
};