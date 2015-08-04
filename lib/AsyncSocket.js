var shortid = require('shortid'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    q = require('deferred');

/**
 * Allows sending a web socket request and waiting for a asynchronous response.
 * This class can be used on the server and client at the same time.
 * Clients provide a socket api to the constructor, servers use the 
 * 'addSocket' method for each connected client.
 * 
 * A socket api is a simple interface between any abstraction of a websocket
 * (socket.io, etc.) and this library.
 * 
 * @param {SocketApi} api A SocketAPi instance wrapping the socket to send 
 * requests on.
 */
function AsyncSocket(api){
    if(!(this instanceof AsyncSocket)){
        return new AsyncSocket(api);
    }
    EventEmitter.call(this);
    
    if(api){
        this.addSocket(api);
        this.srvApi = api;
    }
    this.openRequests = {};
    this.requestListeners = {};
}
util.inherits(AsyncSocket, EventEmitter);

/**
 * Handles incoming messages of any type.
 * @private
 * 
 * @param {*} data The incoming data object. Could be of any
 * type, also depending on the Api.
 * @param {SocketApi} api The socket api where the message was received from.
 */
AsyncSocket.prototype.__handleMessage = function(data, api){
    if(data.__async === '__req'){
        var req = {
            id: data.id,
            content: data.content,
            type: data.type
        };
        this.emit('request', req, api);
        //todo: Allow canceling requests before they are handled.
        this.__handleRequest(req, api);
    }else if(data.__async === '__res'){
        var res = {
            id: data.id,
            content: data.content,
            type: data.type
        };
        this.emit('response', api, res);
        //todo: Allow canceling responses before they are handled.
        this.__handleRespose(res, api);
    }
};

/**
 * Registers a socket api. Incoming messages on this api
 * will be handled when necessary.
 * @public
 * 
 * @param {SocketApi} api The socket api to register.
 */
AsyncSocket.prototype.addSocket = function(api){
    var _this = this;
    api.onmessage(function(msg){ _this.__handleMessage(msg, api); });
};

/**
 * Creates a new asyncronous request, either to the provided socket api
 * or to the one which was provided to this instancence's constructor.
 * If no callback was specified, this method returns a promise instead.
 * @public
 * 
 * @param {string} The request type.
 * @param {*} data The data to send withing the request.
 * @param {SocketApi} [api] Optional socket api to send the request to.
 * @param {function} [callback] Optional callback to use instead of a promise.
 * 
 * @returns {void|Promise} A promise if no callback was provided. 
 */
AsyncSocket.prototype.request = function(type, data, api, callback){
    var _api = api || this.srvApi;
    if(!_api){
        throw new Error('Provide an api instance or initialize AsyncSocket\
        with a server api to use this function.');
    }
    var id = shortid.generate();
    _api.send({
        __async: '__req',
        type: type,
        content: data,
        id: id
    });
    
    var d = q();
    this.openRequests[type + '-' + id] = d;
    
    if(typeof callback === 'function'){
        d.promise.then(function(res, api) {
            callback(null, res, api);
        }, function(err, api) {
            callback(err, null, api);
        });
    }else{
        return d.promise;
    }
};

/**
 * Registers a handler for a specific request type.
 * The handler function can throw an error or directly return a value.
 * If async, the handler can return a promise or take a third callback 
 * parameter.
 * @public
 * 
 * @param {string} type Request type.
 * @param {function} handler The handler function to register.
 */
AsyncSocket.prototype.onRequest = function(type, handler){
    var _this = this;
    
    this.requestListeners[type] = this.requestListeners[type] || [];
    this.requestListeners[type].push(function(req, api){
        _this.__callRequestHandler(handler, req).then(function(res){
            _this.__respond(api, res, req.id, req.type);
        }, function(err){
            var e = err instanceof Error ? err : Error(err);
            _this.__respond(api, e, req.id, req.type);
        });
    });
};

/**
 * Calls a registered request handler.
 * @private
 * 
 * @param {function} handler The handler function to call.
 * @param {req} The current request object.
 */
AsyncSocket.prototype.__callRequestHandler = function(handler, req){
    var tempD = q(), cb, resp;
    
    // use a custom callback if the handler requests one:
    if(handler.length >= 3){
        cb = function(err, result){
            if(err){
                tempD.reject(err);
            }else{
                tempD.resolve(result);
            }
        };
    }
    
    // reject the promise if the handler throws an exception,
    // no matter if it's a sync or async handler:
    try {
        resp = handler(req.content, req.socket, cb);
        if(q.isPromise(resp)){
            // The handler returned a promise by itself:
            return resp;
        }else if(!cb){
            tempD.resolve(resp);
        }
    } catch (e) {
        tempD.reject(e);
    }
    
    return tempD.promise;
};

/**
 * Writes a response to the specified socket api.
 * @private
 * 
 * @param {SocketApi} The api to write the response to.
 * @param {*} Any data to send back to the requester.
 * @param {string} The original request ID.
 * @param {type} The original request type.
 */
AsyncSocket.prototype.__respond = function(api, data, reqId, type){
    var isErr = data instanceof Error,
        d = isErr ? this.__createErr(data) : data;
    api.send({
        id: reqId, content: d, type: type, __async: '__res', err: isErr
    });
};

/**
 * Creates a a stringifiable version of an error instance.
 * @private
 * 
 * @param {Error} The error instance to stringify.
 * @returns {object}
 */
AsyncSocket.prototype.__createErr = function(err){
    return {
        message: err.message,
        stack: err.stack,
        status: err.status || 500
    };
};

/**
 * Handles all incoming responses.
 * This method should only be called with a valid asyncronous response.
 * @private
 * 
 * @param {object} res The current response object.
 * @param {SocketApi} The socket api where the response is coming from.
 */
AsyncSocket.prototype.__handleRespose = function(res, api){
    var reqQualifier = res.type + '-' + res.id;
    var promise = this.openRequests[reqQualifier];
    if(q.isPromise(promise)){
        if(!res.err){
            promise.resolve(res.content, api.getSocket());
        }else{
            var err = new Error(res.content.message);
            err.status = res.content.status;
            err.stack = res.content.stack;
            promise.reject(err, api.getSocket());
        }
        
        // remove the cached request now:
        delete this.openRequests[reqQualifier];
    }
};

/**
 * Handles an incoming request. Only call this function with a valid 
 * asyncronous request object.
 * @private
 * 
 * @param {object} req The current request object.
 * @param {SocketApi} The socket api where this request is coming from.
 */
AsyncSocket.prototype.__handleRequest = function(req, api){
    var listeners = this.requestListeners[req.type];
    req.socket = api.getSocket();
    if(listeners instanceof Array){
        listeners.forEach(function(l){
            l(req, api);
        });
    }else{
        var err = new Error('No listener for ' + req.type + ' attached');
        this.__respond(api, err, req.id, req.type);
    }
};


module.exports = AsyncSocket;