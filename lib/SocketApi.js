/**
 * Returns a not-implemented error.
 * 
 * @returns {Error}
 */
var __ABSTRACT_MEMBER_ERR = function(){ 
    return new Error(
        'Not implemented. Use an instance of a derived class instead.');
};

/**
 * Abstract base class of all derived web socket interfaces.
 * 
 * @param {object} The socket to wrap.
 */
function SocketApi(socket){
    if(!(this instanceof SocketApi)){
        return new SocketApi(socket);
    }
    
    this.socket = socket;
}

/**
 * When implemented in a derived class, this method sends data over the
 * wrapped socket.
 */
SocketApi.prototype.send = function(data){
    throw __ABSTRACT_MEMBER_ERR();
};

/**
 * When implemented in a derived class, this method registers a listener for
 * incoming messages on the wrapped socket.
 * 
 * @param {function} handler The handler function to attach.
 */
SocketApi.prototype.onMessage = function(handler){
    throw __ABSTRACT_MEMBER_ERR();
};

/**
 * Returns the wrapped socket. This method does not have to be implemented
 * in derived classes.
 * 
 * @returns {object}
 */
SocketApi.prototype.getSocket = function(){
    return this.socket;
};


module.exports = SocketApi;