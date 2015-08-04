var customSocketApi = require('./customSocketApi');

/**
 * Interface used for socket.io web socket instances.
 */
module.exports = customSocketApi(function(socket, data){
    socket.send(data);
}, function(socket, handler){
    socket.on('message', handler);
});