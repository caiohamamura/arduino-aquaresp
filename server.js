const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parse');

var connectedDevices = {};
if (typeof app === 'undefined')
{
  app = require('express')();
}

const PORT = process.env.PORT || 80;
const INDEX = '/index.html';
const SCRIPT = '/script.js';

app.use(cors());


const server = http.createServer(app);
const io = socketio(server, {
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST",
      "Access-Control-Allow-Credentials": true
    });
  }
});


io.use((socket, next) => {
  const { key } = cookieParser.parse(socket.handshake.headers.cookie);

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


io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', (msg) => {
    let matchRes = msg.toString().match(/name=(\w+)/);
    if (matchRes?.length == 2) {
      let name = matchRes[1];
      connectedDevices[name] = null;
      connectedDevices[name] = socket;
      console.log(`${name} connected!!!`);
      io.emit('message', `${name} connected!!!`);
      return;
    }

    let arrayMsg = msg.toString().split(" ");
    let target = arrayMsg[0];
    if (arrayMsg.length == 3 && target in connectedDevices) {
      connectedDevices[target].emit('message', msg);
      socket.emit('message', `Sent message to ${target}`);
    } else {
      io.emit('message', msg);
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
