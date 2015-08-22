var dde = require('../index.js');
var timelineplayer = require('timelineplayer');

var client, clients;

var i = 0;
var id = setInterval(function() { console.log('v8 thread-' + i++)}, 1000);

(new timelineplayer([

[1000, function() {

  client = dde.createClient('myapp', 'mytopic');

  console.log(client.service());
  console.log(client.topic());
  console.log(client.isConnected());
  console.log(client.isPaused());

  client.connect();

  console.log(client.isConnected());

  client.on('disconnected', function(service, topic, isDisposed, isServerInitiated) {
    console.log('OnDsconnected: '
      + 'Service: ' + service
      + ', Topic: ' + topic
      + ', IsDisposed: ' + isDisposed
      + ', IsServerInitiated: ' + isServerInitiated);
  });

  client.on('advise', function(service, topic, item, text) {
    console.log('OnAdvise: '
      + 'Service: ' + service
      + ', Topic: ' + topic
      + ', Item: ' + item
      + ', Text: ' + text);
  });

  client.startAdvise('myitem');

}],

[7000, function() {

  client.stopAdvise('myitem');
  client.dispose();

}],

[8000, function() {

  clients = dde.createClients({
    myapp: {
      mytopic1: ['myitem1', 'myitem2'],
      mytopic2: ['myitem1', 'まいあいてむ２']
    }
  }, 'shift_jis');
  console.log(clients.service());
  console.log(clients.topic());
  console.log(clients.isConnected());
  console.log(clients.isPaused());

  clients.connect();

  console.log(clients.isConnected());

  clients.on('disconnected', function(service, topic, isDisposed, isServerInitiated) {
    console.log('Service: ' + service
      + ', Topic: ' + topic
      + ', IsDisposed: ' + isDisposed
      + ', IsServerInitiated: ' + isServerInitiated);
  });

  clients.on('advise', function(service, topic, item, text) {
    console.log('Service: ' + service
      + ', Topic: ' + topic
      + ', Item: ' + item
      + ', Text: ' + text);
  });

  clients.startAdvise();

}],

[13000, function() {

  clients.stopAdvise();
  clients.dispose();

  clearInterval(id);

}]

], function(p, v) {
  v[1]();
})).play();