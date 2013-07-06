Node-dde
========

Node-dde is a simplified regacy win32 Dynamic Data Exchange (DDE) wrapper for node.js using [Edge.js](https://github.com/tjanczuk/edge) and [NDde](http://ndde.codeplex.com/). The client listen to the asynchronous **advice** on multi-threaded CLR without blocking the node.js event loop.

# Client

A example to listen to the asynchronous advices from a single service-topic-item source is follows:

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

A example to listen to the asynchronous advices from multiple service-topic-item sources is follows:

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

# Server

A example to push the advice to the client is follows:

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

# TODO

More doc and tests...

# License

Copyright (c) 2013 thunder9 licensed under the MIT license.