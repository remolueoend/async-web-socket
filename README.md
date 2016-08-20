# async-web-socket
Library which helps to create request/response based websocket requests.

If you want to create a websocket based request and wait for a response of the server, use this library to simplify the process.

## Simple Example
```javascript

// async = async-web-socket instance, see below how to create one.

// client
async.request('update', {optional: 'data'}).then(function(res){
  // res contains the server response.
}, function(err){
  // gets called when the server returns an error.
});

// server
async.onRequest('update', function(content, req){
  // content = client data
  // req = request object
  
  return {server: 'data'};
});
```

## Creating an AsyncSocket class
The library is compatible with any possible websocket library, such as ws, socket.io, etc. by allowing customized interfaces between the websocket library and async-web-socket. 

### Using socket.io
If you are using socket.io, you do not have to define a custom interface. async-web-socket uses a built-in interface:
```javascript
// client 
var io = require('socket.io')('http://localhost');
var async = require('async-web-socket).io(io, [options]);

// server
var io = require('socket.io')(8080);
// You do not have to provide a socket here. You're the server:
var async = require('async-web-socket').io(null, [options]);
io.on('connect', function(socket){
  // add the client socket as soon as it connects to the server:
  async.addSocket(socket);
});
```
