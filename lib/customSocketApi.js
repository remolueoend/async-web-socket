var SocketApi = require('./SocketApi'),
    util = require('util');

/**
 * Creates a custom SocketAPI class based on the given methods.
 * 
 * @param {function} sendFn Gets called to send data over the web socket 
 * interface wrapped by the custom API. This function should take two params:
 * The underlying socket and the data to send.
 * @param {function} onMessageFn This function gets called to add a handler
 * for incoming messages on the wrapped web socket interface. This function
 * should take two params: The underlying socket and the handler to register.
 */
function createSocketApi(sendFn, onMessageFn){
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
     * 
     * @param {*} data The data to send.
     */
    CustomApi.prototype.send = function(data){
        sendFn(this.socket, data);
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
    
    return CustomApi;
}

module.exports = createSocketApi;