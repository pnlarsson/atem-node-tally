// https://github.com/nrkno/tv-automation-atem-connection

const { Atem } = require('atem-connection')
const myAtem = new Atem()
myAtem.on('info', console.log)
myAtem.on('error', console.error)

myAtem.connect('192.168.100.241')

const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

ws = null;

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })

  ws.send('ho!')
})

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
		source = command.properties.source;
		console.log('PrgI got - source: ' + source);


		wss.clients.forEach(function each(ws) {
			ws.send('PrgI got - source: ' + source);
		});
	}

	if(command.rawName == 'PrvI'){
		source = command.properties.source;
		console.log('PrvI got - source: ' + source);
		wss.clients.forEach(function each(ws) {
			ws.send('PrvI got - source: ' + source);
		});
	}
});