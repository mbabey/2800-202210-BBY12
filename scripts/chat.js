'use strict';
let socket = io.connect('/');

let messageContainer = document.querySelector('#message-content');
let messageSendButton = document.querySelector('#message-submit');
let messageInput = document.querySelector('#message-input');

socket.onAny((event, ...args) => {
  console.log(event, args);
});

async function getData(path, callback) {
  try {
    let response = await fetch(path, {
      method: 'GET'
    });
    response = await response.text();
    response = JSON.parse(response);
    callback(response);
  } catch (err) {
    console.log(err);
  }
}

let thisUser;

getThisUser();

function getThisUser() {
  getData('/get-user', (results) => {
    thisUser = results[0].username;
    socket.emit('new-connection', thisUser);
  });
}

// Catch messages coming from the server and display it on the DOM.
socket.on('chat-message', (data, user) => {
  addMessage(data, user);
});

// Send messages to the server by pressing the send button.
messageSendButton.addEventListener('click', e => {
  e.preventDefault();
  let message = messageInput.value;
  socket.emit('send-message', message, thisUser);
  messageInput.value = "";
});

// Builds the DOM for a message.
function addMessage(message, user) {
  let messageElement = document.createElement("span");
  messageElement.classList.add('message');
  messageElement.innerHTML += message;

  if (thisUser === user) {
    messageElement.classList.add('self-message');
  } else {
    messageElement.classList.add('other-message');
  }

  messageContainer.append(messageElement);
}
