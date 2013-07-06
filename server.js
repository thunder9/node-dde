var edge = require('edge');

var getInvoker = edge.func({
    source: __dirname + '/server.cs',
    references: [ __dirname + '/vendor/NDde.dll' ],
    typeName: 'NodeDde.Server',
    methodName: 'GetInvoker'
});

function Server(service) {
  var self = this;
  var opts = {
    service: service,
    callbacks: {
      OnBeforeConnect: function(o, callback) {
        self.emit('before connect', o.topic);
        var result = self.onBeforeConnect(o.topic);
        callback(null, result);
      },
      OnAfterConnect: function(o) {
        self.emit('after connect', o.service, o.topic);
        self.onAfterConnect(o.service, o.topic);
      },
      OnDisconnect: function(o) {
        self.emit('disconnect', o.service, o.topic);
        self.onDisconnect(o.service, o.topic);
      },
      OnStartAdvise: function(o, callback) {
        self.emit('start advise', o.service, o.topic, o.item, o.format);
        var result = self.onStartAdvise(o.service, o.topic, o.item, o.format);
        callback(null, result);
      },
      OnStopAdvise: function(o) {
        self.emit('start advise', o.service, o.topic, o.item);
        self.onStopAdvise(o.service, o.topic, o.item);
      },
      OnExecute: function(o, callback) {
        self.emit('execute', o.service, o.topic, o.command);
        var result = self.onExecute(o.service, o.topic, o.command);
        callback(null, result);
      },
      OnPoke: function(o, callback) {
        self.emit('poke', o.service, o.topic, o.item, o.data, o.format);
        var result = self.onPoke(o.service, o.topic, o.item, o.data, o.format);
        callback(null, result);
      },
      OnRequest: function(o, callback) {
        self.emit('request', o.service, o.topic, o.item, o.format);
        var result = self.onRequest(o.service, o.topic, o.item, o.format);
        callback(null, result);
      },
      OnAdvise: function(o, callback) {
        self.emit('advise', o.topic, o.item, o.format);
        var result = self.onAdvise(o.topic, o.item, o.format);
        callback(null, result);
      }
    }
  }
  this._invoke = getInvoker(opts, true);

  this.onBeforeConnect = function() { return true; };
  this.onAfterConnect = function() {};
  this.onDisconnect = function() {};
  this.onStartAdvise = function() { return true; };
  this.onStopAdvise = function() {};
  this.onExecute = function() {};
  this.onPoke = function() {};
  this.onRequest = function() { return ''; };
  this.onAdvise = function() { return ''; };
}

Server.prototype.register = function() {
  this._invoke({
    method: 'Register'
  }, true);
};

Server.prototype.unregister = function() {
  this._invoke({
    method: 'Unregister'
  }, true);
};

Server.prototype.advise = function(topic, item) {
  this._invoke({
    method: 'Advise',
    topic: topic || this.topic,
    item: item || this.item
  }, function() {});
};

Server.prototype.disconnect = function() {
  this._invoke({
    method: 'Disconnect'
  }, true);
};

Server.prototype.pause = function() {
  this._invoke({
    method: 'Pause'
  }, true);
};

Server.prototype.resume = function() {
  this._invoke({
    method: 'Resume'
  }, true);
};

Server.prototype.dispose = function() {
  this._invoke({
    method: 'Dispose'
  }, true);
};

Server.prototype.service = function() {
  return this._invoke({
    method: 'Service'
  }, true);
};

Server.prototype.isRegistered = function() {
  return this._invoke({
    method: 'IsRegistered'
  }, true);
};

Server.prototype.__proto__ = require('events').EventEmitter.prototype;

exports.createServer = function(service) {
  return new Server(service);
};