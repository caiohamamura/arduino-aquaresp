// Display received messages
const div = document.getElementById("received-messages");


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


let authToken = getAuthCookie();
let authForm = document.getElementById("auth-form");
let authInput = document.getElementById("auth-token-input");
let messageForm = document.getElementById("message-form");
let socket;

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
    socket = new WebSocket(`ws://192.168.0.119`);

    configureSocket(socket);
}

function configureSocket(socket) {
    socket.onopen = function () {
        console.log('conectado');
    };
    
    socket.onmessage = data => {
        console.log(data);
        let msg = data.data;
        div.innerHTML += "<div>" + msg + "</div>";
    };
    
    socket.onclose = function (message) {
        console.log('desconectado');
        connectSocket(localStorage['token']);
    };
}


// Send message on form submit
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = document.getElementById("message-input");
    socket.send(input.value);
    input.value = "";
});


