Node-dde
========

Node-dde is a simplified regacy win32 Dynamic Data Exchange (DDE) wrapper for node.js using [Edge.js](https://github.com/tjanczuk/edge) and [NDde](http://ndde.codeplex.com/). The client listen to the asynchronous *advise* on multi-threaded CLR without blocking the node.js event loop.

# Installation

Run the following in your project folder:

```
npm install node-dde
```

# Example

## Client

Example to listen to the asynchronous advise from a single service-topic-item source is the following:

```javascript
var dde = require('node-dde');

client = dde.createClient('myapp', 'mytopic');

client.on('advise', function(service, topic, item, text) {
  console.log('OnAdvise: '
    + 'Service: ' + service
    + ', Topic: ' + topic
    + ', Item: ' + item
    + ', Text: ' + text);
});

client.connect();

client.startAdvise('myitem');
```

Example to listen to the asynchronous advise from multiple service-topic-item sources is the following:

```javascript
var dde = require('node-dde');

clients = dde.createClients({
    myapp: {
        mytopic1: ['myitem1', 'myitem2'],
        mytopic2: ['myitem1', 'myitem2']
    }
});

clients.on('advise', function(service, topic, item, text) {
  console.log('OnAdvise: '
    + 'Service: ' + service
    + ', Topic: ' + topic
    + ', Item: ' + item
    + ', Text: ' + text);
});

clients.connect();

clients.startAdvise();
```

Example of sending an asynchronous advise to the browser in realtime using [Socket.IO](https://github.com/learnboost/socket.io) is the following:

```javascript
var io = require('socket.io').listen(80);

var dde = require('node-dde').createClient('myapp', 'mytopic');

dde.on('advise', function(service, topic, item, text) {
  io.sockets.emit('advise', { item: item, text: text });
});

dde.connect();

dde.startAdvise('myitem');
```

## Server

Example to push the asynchronous advise to the client is the following:

```javascript
var dde = require('node-dde');

server = dde.createServer('myapp');

server.on('disconnect', function(service, topic) {
  console.log('OnDisconnect: '
    + 'Service: ' + service
    + ', Topic: ' + topic);
});

server.on('advise', function(topic, item, format) {
  console.log('OnAdvise: '
    + 'Topic: ' + topic
    + ', Item: ' + item
    + ', Format: ' + format);
});

var i = 0;
server.onAdvise = function() {
  return 'advise-' + i++;
};

setInterval(function() { server.advise('*', '*'); }, 1000);

server.register();
```

# Methods

```javascript

// Client

client = dde.createClient(service, topic)
client.connect()
client.disconnect()
client.pause()
client.resume()
client.execute(command, timeout)
client.poke(item, data, timeout)
client.request(item, format, timeout)
client.startAdvise(item, format, hot, timeout)
client.stopAdvise(item, timeout)
client.beginExecute(command, oncomplete)
client.beginPoke(item, data, format, oncomplete)
client.beginRequest(item, format, oncomplete)
client.beginStartAdvise(item, format, hot, oncomplete)
client.beginStopAdvise(item, oncomplete)
client.dispose()
client.service()
client.topic()
client.isConnected()
client.isPaused()

// Clients

clients = dde.createClients(services)
clients.connect()
clients.disconnect()
clients.pause()
clients.resume()
clients.execute(command, timeout)
clients.poke(data, timeout)
clients.request(format, timeout)
clients.startAdvise(format, hot, timeout)
clients.stopAdvise(timeout)
clients.dispose()
clients.service()
clients.topic()
clients.isConnected()
clients.isPaused()

// Server

server = dde.createServer(service)
server.register()
server.unregister()
server.advise(topic, item)
server.disconnect()
server.pause()
server.resume()
server.dispose()
server.service()
server.isRegistered()
```

# Events

```javascript

// Client

client.on('disconnected', function(service, topic, isDisposed, isServerInitiated) {})
client.on('advise', function(service, topic, item, text) {})

// Clients

clients.on('disconnected', function(service, topic, isDisposed, isServerInitiated) {})
clients.on('advise', function(service, topic, item, text) {})

// Server

server.on('before connect', function(topic) {})
server.on('after connect', function(service, topic) {})
server.on('disconnect', function(service, topic) {})
server.on('start advise', function(service, topic, item, format) {})
server.on('stop advise', function(service, topic, item) {})
server.on('execute', function(service, topic, command) {})
server.on('poke', function(service, topic, item, data, format) {})
server.on('request', function(service, topic, item, format) {})
server.on('advise', function(topic, item, format) {})
```

# Overridable callbacks

```javascript

// Client

// N/A

// Clients

// N/A

// Server

server.onBeforeConnect = function(topic) { return true; };
server.onAfterConnect = function(service, topic) {};
server.onDisconnect = function(service, topic) {};
server.onStartAdvise = function(service, topic, item, format) { return true; };
server.onStopAdvise = function(service, topic, item) {};
server.onExecute = function(service, topic, command) {};
server.onPoke = function(service, topic, item, data, format) {};
server.onRequest = function(service, topic, item, format) { return ''; };
server.onAdvise = function(topic, item, format) { return ''; };
```

# License

Copyright (c) 2013 thunder9 licensed under the MIT license.