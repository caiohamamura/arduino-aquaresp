const http = require('http');

const PORT = process.env.PORT || 80;
const INDEX = '/index.html';
const SCRIPT = '/script.js';

if (typeof app === 'undefined')
  app = require('express')();


const server = http.createServer(app);
app.get('/', function (req, res, next) {
  res.sendFile(INDEX, { root: __dirname });
});

app.get('/script.js', function (req, res, next) {
  res.sendFile(SCRIPT, { root: __dirname });
});

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
