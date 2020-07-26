// https://github.com/nrkno/tv-automation-atem-connection

const { Atem } = require('atem-connection')
const myAtem = new Atem()
myAtem.on('info', console.log)
myAtem.on('error', console.error)

myAtem.connect('192.168.100.241')

var sourcePreview = null;
var sourceProgram = null;

const WebSocket = require('ws')

function noop() {}

function heartbeat() {
	this.isAlive = true;

	console.log('Got pong');
}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws, req) {
	const ip = req.socket.remoteAddress;

	console.log(`Client connected: ` + ip);

	ws.isAlive = true;

	ws.on('pong', heartbeat);

	ws.on('message', message => {
		console.log(`Received message => ${message}`)
	})

	ws.send(JSON.stringify({"type": "preview", "source":sourcePreview}));
	ws.send(JSON.stringify({"type": "program", "source":sourceProgram}));
})

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate();

		ws.isAlive = false;
		ws.ping(noop);
		console.log('Sent ping');
	});
}, 30000);

wss.on('close', function close() {
	clearInterval(interval);
});

myAtem.on('connected', () => {
	// myAtem.changeProgramInput(3).then(() => {
		// Fired once the atem has acknowledged the command
		// Note: the state likely hasnt updated yet, but will follow shortly
		// console.log('Program input set')
	// })
	console.log(myAtem.state)
})

myAtem.on('stateChanged', (state, pathToChange) => {
	// console.log(state); // catch the ATEM state.
	// console.log(pathToChange); // catch the ATEM state.
});

myAtem.on('receivedCommand', (command) => {
	// console.log(command);

	// if(command.rawName == 'TlSr'){
	// 	console.log('TlSr');
	// }

	if(command.rawName == 'PrgI'){
		sourceProgram = command.properties.source;
		console.log('PrgI got - source: ' + sourceProgram);

		wss.clients.forEach(function each(ws) {
			ws.send(JSON.stringify({"type": program, "source":sourceProgram}));
		});
	}

	if(command.rawName == 'PrvI'){
		sourcePreview = command.properties.source;
		console.log('PrvI got - source: ' + sourcePreview);

		wss.clients.forEach(function each(ws) {
			ws.send(JSON.stringify({"type": preview, "source":sourcePreview}));
		});
	}
});

function intervalFunc() {
	var state = 'program';
	var source = getRandomInt(1, 4);

	if(getRandomInt(0, 2) > 0){
		state = 'preview';
	}

	if(state == 'preview'){
		sourcePreview = source;
	}else{
		sourceProgram = source;
	}

	console.log("state " + state + " source " + source);

	wss.clients.forEach(function each(ws) {
		ws.send(JSON.stringify({"type": state, "source":source}));
	});
}

setInterval(intervalFunc, 1500);

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
