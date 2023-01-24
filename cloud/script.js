const firebaseConfig = {
    apiKey: "AIzaSyD1fPoERfI700g03S_Omsk_RRZBliyDLso",
    authDomain: "aquaresp.firebaseapp.com",
    databaseURL: "https://aquaresp-default-rtdb.firebaseio.com",
    projectId: "aquaresp",
    storageBucket: "aquaresp.appspot.com",
    messagingSenderId: "457840223205",
    appId: "1:457840223205:web:77e24e08d750950501450c"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);
const auth = firebase.auth(app);

// Get the authentication token from the cookie
var authForm = document.getElementById("auth-form");
var userName = document.getElementById("user-name");
var password = document.getElementById("password");
var messageForm = document.getElementById("message-form");
var signOut = document.getElementById("sign-out");

if (localStorage['username'] === undefined || localStorage['password'] === undefined) {
    authForm.style.display = "block";
    signOut.style.diplay = 'none';
    authForm.addEventListener("submit", function (event) {
        event.preventDefault();
        localStorage['username'] = userName.value;
        localStorage['password'] = password.value;
        authFirebase();
    });
} else {
    authFirebase();
}

let ref;

async function authFirebase() {
    authForm.style.display = "none";
    signOut.style.display = 'block';
    await auth.signInWithEmailAndPassword(localStorage['username'], localStorage['password']);
    ref = database.ref(`${auth.getUid()}/message`);
}

messageForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var input = document.getElementById("message-input");
    ref.set(input.value);
    input.value = "";
});

async function signOut() 
{
    await auth.signOut();
    signOut.style.diplay = 'none';
    authForm.style.display = "block";
    localStorage.removeItem('username');      
    localStorage.removeItem('password');
    userName.value = '';
    password.value = '';
}