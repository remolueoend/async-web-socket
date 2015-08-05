var customSocketApi = require('./customSocketApi');

/**
 * Sends a message to a socket.io socket instance
 * 
 * @param {*} data Data to send.
 */
function send(socket, dataToSend){
    socket.send(dataToSend);
}

/**
 * Attaches a 'message' listener to an socket.io socket instance.
 * 
 * @param {function} handler The handler fucntion to attach.
 */
function onMessage(socket, handler){
    socket.on('message', handler);
}

/**
 * Attaches a 'disconnect' listener to an socket.io socket instance.
 * 
 * @param {function} handler The handler fucntion to attach.
 */
function onDisconnect(socket, handler){
    socket.on('disconnect', handler);
}

/**
 * Interface used for socket.io web socket instances.
 */
module.exports = customSocketApi(
    send, 
    onMessage, 
    onDisconnect
);