var dde = require('../index.js');
var timelineplayer = require('timelineplayer');

var server;

var id = setInterval(function() { server.advise('*', '*'); }, 1000);

(new timelineplayer([

[0, function() {

  server = dde.createServer('myapp');

  console.log(server.service());
  console.log(server.isRegistered());

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

  server.register();

  console.log(server.isRegistered());

}],

[14000, function() {

  server.disconnect();
  server.unregister();
  server.dispose();

  clearInterval(id);

}]

], function(p, v) {
  v[1]();
})).play();