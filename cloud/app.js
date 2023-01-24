(async () => {
const { initializeApp } = await import("firebase/app");
const { getDatabase, ref, set } = await import("firebase/database");
const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");

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

app.get('/grande/:port/:value', async function (req, res, next) {
  const firebaseConfig = {
    apiKey: "AIzaSyD1fPoERfI700g03S_Omsk_RRZBliyDLso",
    authDomain: "aquaresp.firebaseapp.com",
    databaseURL: "https://aquaresp-default-rtdb.firebaseio.com",
    projectId: "aquaresp",
    storageBucket: "aquaresp.appspot.com",
    messagingSenderId: "457840223205",
    appId: "1:457840223205:web:77e24e08d750950501450c"
  };
  const app = initializeApp(firebaseConfig); 
  const database = getDatabase(app);
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, process.env.user, process.env.password);
  await set(ref(database, `${auth.currentUser.uid}/message`), `gpio${req.params.port} ${req.params.value}`);
  auth.signOut();
  res.send(200);
});

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
})();