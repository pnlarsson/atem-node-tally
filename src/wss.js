'use strict';

const config = require('./../config');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: config.wssPort });

console.log(`WebSocket server running on port ${config.wssPort}`);

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

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;

    console.log(`Client connected: ` + ip);

    ws.isAlive = true;

    ws.on('pong', wss.heartbeat);

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })
})

wss.noop = function() {}

wss.heartbeat = function() {
	this.isAlive = true;

	console.log('Got pong');
}

module.exports = wss;
