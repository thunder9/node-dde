var edge = require('edge');

var getInvoker = edge.func({
  source: __dirname + '/client.cs',
  references: [ __dirname + '/vendor/NDde.dll', 'System.Web.dll' ],
  typeName: 'NodeDde.Client',
  methodName: 'GetInvoker'
});

function Clients(services, encoding) {
  var self = this;
  var opts = {
    services: services,
    callbacks: {
      OnDisconnected: function(o) {
        self.emit('disconnected', o.service, o.topic, o.isDisposed, o.isServerInitiated);
      },
      OnAdvise: function(o) {
        self.emit('advise', o.service, o.topic, o.item, o.text);
      }
    }
  }
  if (encoding) opts.encoding = encoding;
  this._invoke = getInvoker(opts, true);
  this.command = this.data = '';
  this.format = 1;
  this.hot = true;
  this.timeout = 10000;
}

Clients.prototype.connect = function() {
  this._invoke({
    method: 'Connect'
  }, true);
};

Clients.prototype.disconnect = function() {
  this._invoke({
    method: 'Disconnect'
  }, true);
};

Clients.prototype.pause = function() {
  this._invoke({
    method: 'Pause'
  }, true);
};

Clients.prototype.resume = function() {
  this._invoke({
    method: 'Resume'
  }, true);
};

Clients.prototype.execute = function(command, timeout) {
  this._invoke({
    method: 'Execute',
    command: command || this.command,
    timeout: timeout || this.timeout
  }, true);
};

Clients.prototype.poke = function(data, timeout) {
  this._invoke({
    method: 'Poke',
    item: this.item || '',
    data: data || this.data,
    timeout: timeout || this.timeout
  }, true);
};

Clients.prototype.request = function(format, timeout) {
  return this._invoke({
    method: 'Request',
    item: this.item || '',
    format: format || this.format,
    timeout: timeout || this.timeout
  }, true);
};

Clients.prototype.startAdvise = function(format, hot, timeout) {
  this._invoke({
    method: 'StartAdvise',
    item: this.item || '',
    format: format || this.format,
    hot: hot || this.hot,
    timeout: timeout || this.timeout
  }, true);
};

Clients.prototype.stopAdvise = function(timeout) {
  this._invoke({
    method: 'StopAdvise',
    item: this.item || '',
    timeout: timeout || this.timeout
  }, true);
};

Clients.prototype.dispose = function() {
  this._invoke({
    method: 'Dispose'
  }, true);
};

Clients.prototype.service = function() {
  return this._invoke({
    method: 'Service'
  }, true);
};

Clients.prototype.topic = function() {
  return this._invoke({
    method: 'Topic'
  }, true);
};

Clients.prototype.isConnected = function() {
  return this._invoke({
    method: 'IsConnected'
  }, true);
};

Clients.prototype.isPaused = function() {
  return this._invoke({
    method: 'IsPaused'
  }, true);
};

Clients.prototype.__proto__ = require('events').EventEmitter.prototype;

exports.Clients = Clients;

exports.createClients = function(services, encoding) {
  return new Clients(services, encoding);
};