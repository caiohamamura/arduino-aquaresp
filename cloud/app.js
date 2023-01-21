const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');

var connectedDevices = {};

const PORT = process.env.PORT || 80;
const INDEX = '/index.html';
const SCRIPT = '/script.js';

if (typeof app === 'undefined') {
  var app = require('express')();
}
app.use(cors());


const server = http.createServer(app);
const wss = new WebSocket.Server({
  server
});


const broadcast = (msg) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
};

wss.on('upgrade', async (request, socket) => {
  const { key } = cookieParser.parse(request.headers.cookie);

  if (!key) {
    return next(new Error('authentication error'));
  }
  // validate key here
  console.log(`The key is: ${process.env.SECRET}`);
  if (key === process.env.SECRET) {
    return next();
  }
  return next(new Error('authentication error'));
});

wss.on('connection', (ws) => {
  console.log('A user has been connected!');

  ws.on('ping', function heartbeat() {
    console.log('Ping');
  });

  ws.on('pong', function heartbeat() {
    console.log('Pong');
  });

  ws.on('message', (data) => {
    let msg = data.toString();
    console.log(`Received message => ${msg}`);
    let matchRes = msg.match(/name=(\w+)/);
    if (matchRes?.length == 2) {
      let name = matchRes[1];
      connectedDevices[name] = null;
      connectedDevices[name] = ws;
      console.log(`${name} connected!!!`);
      broadcast(`${name} connected!!!`);
      
      return;
    }

    let arrayMsg = msg.split(" ");
    let target = arrayMsg[0];
    if (arrayMsg.length == 3 && target in connectedDevices) {
      connectedDevices[target].send(msg);
      ws.send(`Sent message to ${target}`);
    } else {
      broadcast(msg);
    }
  });
});


app.get('/', function (req, res, next) {
  res.sendFile(INDEX, { root: __dirname });
});

app.get('/script.js', function (req, res, next) {
  res.sendFile(SCRIPT, { root: __dirname });
});



server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});

