var AsyncSocket = require('./AsyncSocket'),
    customSocketApi = require('./customSocketApi'),
    SocketApi = require('./SocketApi'),
    util = require('util');

/**
 * Returns if the given ctor implements the super constructor.
 * @private
 * 
 * @param {function} ctor The child constructor to test.
 * @param {function} superCtor The super constructor.
 * @returns {boolean}
 */
function _implements(ctor, superCtor){
    return ctor === superCtor || 
        ctor.prototype instanceof superCtor;
}

/**
 * Creates a custom async socket class based on the given send and onMessage 
 * functions.
 * 
 * @param {function} param1 This function has to send data over 
 * the wrapped socket. The function should take two params: The underlying
 * socket and the data to send.
 * @param {function} param2 This function has to attach a listener for
 * incoming messages on the underlying socket. The function should take two
 * params: The underlying socket and the handler function to attach.
 * 
 * OR:
 * 
 * @param {function} param1 The socket api constructor/class which should 
 * be used by the custom async socket class.
 * 
 * @returns {function}
 */
function createCustomAsyncSocket(param1, param2){
    var API;
    if(arguments.length === 1 && _implements(param1, SocketApi)){
        API = param1;
    }else if(typeof param1 === 'function' && typeof param2 === 'function'){
        API = customSocketApi(param1, param2);
    }else{
        throw 'Invalid arguments. Provide an ApiSocket constructor or\
        a send function and a onMessage function.';
    }
    
    /**
     * Custom derived AsyncSocket class using a custom socket api.
     * This function can be called with 'new' or without. It returns a new
     * instance of a CustomAsyncSocket.
     * 
     * @param {object} [serverSocket] An optional server socket to use for
     * requests. 
     * 
     * @returns {CustomAsyncSocket}
     */
    function CustomAsyncSocket(serverSocket){
        if(!(this instanceof CustomAsyncSocket)){
            return new CustomAsyncSocket(serverSocket);
        }
        
        var api = serverSocket ? new API(serverSocket) : void 0;
        AsyncSocket.call(this, api);
    }
    util.inherits(CustomAsyncSocket, AsyncSocket);
    
    /**
     * Adds a custom client socket to the instance.
     * 
     * @param {object} socket The custom socket instance to add.
     */
    CustomAsyncSocket.prototype.addSocket = function(socket){
        var base = CustomAsyncSocket.super_.prototype.addSocket;
        base.call(this, new API(socket));
    };
    
    return CustomAsyncSocket;
}

module.exports = createCustomAsyncSocket;