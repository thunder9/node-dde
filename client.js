var Clients = require('./clients.js').Clients;

function Client(service, topic) {
  var services = {};
  services[service] = {};
  services[service][topic] = null;
  Clients.call(this, services);
}

Client.prototype.poke = function(item, data, timeout) {
  this.item = item;
  Clients.prototype.poke.call(this, data, timeout);
};

Client.prototype.request = function(item, format, timeout) {
  this.item = item;
  return Clients.prototype.request.call(this, format, timeout);
};

Client.prototype.startAdvise = function(item, format, hot, timeout) {
  this.item = item;
  Clients.prototype.startAdvise.call(this, format, hot, timeout);
};

Client.prototype.stopAdvise = function(item, timeout) {
  this.item = item;
  Clients.prototype.stopAdvise.call(this, timeout);
};

Client.prototype.beginExecute = function(command, oncomplete) {
  this._invoke({
    method: 'BeginExecute',
    command: command || this.command,
  }, oncomplete);
};

Client.prototype.beginPoke = function(item, data, format, oncomplete) {
  this._invoke({
    method: 'BeginPoke',
    item: item || this.item,
    data: data || this.data,
    format: format || this.format,
  }, oncomplete);
};

Client.prototype.beginRequest = function(item, format, oncomplete) {
  this._invoke({
    method: 'BeginRequest',
    item: item || this.item,
    format: format || this.format,
  }, oncomplete);
};

Client.prototype.beginStartAdvise = function(item, format, hot, oncomplete) {
  this._invoke({
    method: 'BeginStartAdvise',
    item: item || this.item,
    format: format || this.format,
    hot: hot || this.hot,
  }, oncomplete);
};

Client.prototype.beginStopAdvise = function(item, oncomplete) {
  this._invoke({
    method: 'BeginStopAdvise',
    item: item || this.item,
  }, oncomplete);
};

Client.prototype.__proto__ = Clients.prototype;

exports.createClient = function(service, topic) {
  return new Client(service, topic);
};
