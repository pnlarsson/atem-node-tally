'use strict';

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on port 8080');

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate();

		ws.isAlive = false;
		ws.ping(wss.noop);
		console.log('Sent ping');
	});
}, 30000);

wss.on('close', function close() {
	clearInterval(interval);
});

wss.noop = function() {}

wss.heartbeat = function() {
	this.isAlive = true;

	console.log('Got pong');
}

module.exports = wss;
