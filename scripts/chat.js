'use strict';
let socket = io.connect('/');

let messageContainer = document.querySelector('.message-content');
let messageSend = document.querySelector('.message-send-block');
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
  console.log(data);
  addMessage(data);
});

messageSend.addEventListener('click', e => {
  e.preventDefault();
  let message = messageInput.value;
  socket.emit('send-message', message);
  messageInput.value = "";
});

function addMessage(message) {
  let messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML += message;
  messageContainer.append(messageElement);
}
