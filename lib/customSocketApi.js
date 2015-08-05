var SocketApi = require('./SocketApi'),
    util = require('util');

/**
 * Creates a custom SocketAPI class based on the given methods.
 * 
 * @param {function} sendFn Gets called to send data over the web socket 
 * interface wrapped by the custom API. This function will be called with
 * the socket as dirst param, followed by the params of the original call.
 * 
 * @param {function} onMessageFn This function gets called to add a handler
 * for incoming messages on the wrapped web socket interface. This function
 * should take two params: The underlying socket and the handler to register.
 * 
 * @param {function} onDisconnectFn This function gets called to add a handler
 * for a disconnect event on the wrapped web socket interface. This function
 * should take two params: The underlying socket and the handler to register.
 */
function createSocketApi(sendFn, onMessageFn, onDisconnectFn){
    /**
     * Custom constructor. Can be called with 'new' or without.
     * Returns a new instance of a custom socket API.
     * 
     * @param {object} socket The socket instance to wrap.
     */
    function CustomApi(socket){
        if(!(this instanceof CustomApi)){
            return new CustomApi(socket);
        }
        SocketApi.call(this, socket);
    }
    util.inherits(CustomApi, SocketApi);
    
    /**
     * Sends a message over the wrapped socket using the send function
     * provided during the custom api creation.
     * All provided parameters will be redirected to the provided send function.
     */
    CustomApi.prototype.send = function(){
        var args = [this.socket].concat(
            Array.prototype.slice.call(arguments));
        sendFn.apply(void 0, args);
    };
    
    /**
     * Attaches a listener for incomingt messages on the wrapped socket
     * using the onMessage function provided during the custom api creation.
     * 
     * @param {function} handler The handler function to attach.
     */
    CustomApi.prototype.onMessage = function(handler){
        onMessageFn(this.socket, handler);
    };
    
    CustomApi.prototype.onDisconnect = function(handler){
        onDisconnectFn(this.socket, handler);
    };
    
    return CustomApi;
}

module.exports = createSocketApi;