// Set the authentication token as a cookie
function setAuthCookie(token) {
    document.cookie = "key=" + token + ";max-age=34560000;";
}

// Get the authentication token from the cookie
function getAuthCookie() {
    var name = "key=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var authToken = getAuthCookie();
var authForm = document.getElementById("auth-form");
var authInput = document.getElementById("auth-token-input");
var messageForm = document.getElementById("message-form");
var socket;

if (authToken === "") {
    authForm.style.display = "block";
    authForm.addEventListener("submit", function (event) {
        event.preventDefault();
        authToken = authInput.value;
        setAuthCookie(authToken);
        connectSocket();
    });
} else {
    connectSocket();
}

function connectSocket() {
    authForm.style.display = "none";
    messageForm.style.display = "block";
    socket = io();

    // Send message on form submit
    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = document.getElementById("message-input");
        socket.emit("message", input.value);
        input.value = "";
    });

    // Display received messages
    var div = document.getElementById("received-messages");


    socket.on("connect", function (message) {
        console.log('conectado');
    });

    socket.on("message", data => {
        console.log('msg');
        div.innerHTML += "<br>" + data;

    });

    socket.on("disconnect", function (message) {
        console.log('desconectado');
    });
}

