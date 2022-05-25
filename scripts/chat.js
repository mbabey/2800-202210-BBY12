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

socket.on('chat-message', data => {
  addMessage(data);
});

messageSendButton.addEventListener('click', e => {
  e.preventDefault();
  let message = messageInput.value;
  socket.emit('send-message', message);
  messageInput.value = "";
});

function addMessage(message, isSelf = false) {
  let messageElement = document.createElement("span");
  messageElement.classList.add('message');
  messageElement.innerHTML += message;

  if (isSelf) {
    messageElement.classList.add('self-message');
  } else {
    messageElement.classList.add('other-message');
  }

  messageContainer.append(messageElement);
}
