var client = require('./client.js');
var clients = require('./clients.js');
var server = require('./server.js');

exports.createClient = client.createClient;
exports.createClients = clients.createClients;
exports.createServer = server.createServer;