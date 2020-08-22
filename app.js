'use strict';

const http = require('./src/http.js')
const wss = require('./src/wss.js')
const atem = require('./src/atem.js')
const config = require('./config');

http.listen(config.port, 10, () => {
    console.log(`http server running on port ${config.port}`);
});

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;

    console.log(`Client connected: ` + ip);

    ws.isAlive = true;

    ws.on('pong', wss.heartbeat);

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })

    ws.send(JSON.stringify({"type": "preview", "source": atem.tallyState.sourcePreview}));
    ws.send(JSON.stringify({"type": "program", "source": atem.tallyState.sourceProgram}));
})

atem.connect(config.atemServer);

atem.on('updateClients', function(source, state){
    wss.clients.forEach(function each(ws) {
        ws.send(JSON.stringify({"type": state, "source":source}));
    });
});

