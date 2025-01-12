import { WebSocketServer } from 'ws';

function heartbeat() {
  console.log(Date.now(), ' << pong');
  this.isAlive = true;
}

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    console.log(' >> new client connection: ', ip);
    ws.isAlive = true;
    ws.on('error', console.error);
    ws.on('pong', heartbeat);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('Hello Client!');
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
    console.log(Date.now(), ' >> ping');
  });
}, 3000);

wss.on('close', function close() {
  clearInterval(interval);
  console.log('closed.');
});
