'use strict';

const http = require('./src/http.js')
const wss = require('./src/wss.js')
const atem = require('./src/atem.js')
const config = require('./config');

http.listen(config.port, 10, () => {
    console.log(`http server running on port ${config.port}`);
});

atem.connect(config.atemServer);

console.log(`Connecting to atem server on ${config.atemServer}`);

wss.on('connection', function connection(ws, req) {
    ws.send(JSON.stringify({"type": "preview", "source": atem.tallyState.sourcePreview}));
    ws.send(JSON.stringify({"type": "program", "source": atem.tallyState.sourceProgram}));

    console.log('Sent init state to client');
})

atem.on('updateClients', function(source, state){
    wss.clients.forEach(function each(ws) {
        ws.send(JSON.stringify({"type": state, "source":source}));
    });
});
