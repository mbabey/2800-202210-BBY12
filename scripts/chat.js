'use strict';
let socket = io.connect('/');

let messageContainer = document.querySelector('.message-content');
let messageSend = document.querySelector('.message-send-block');
let messageInput = document.querySelector('#message-input');

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
  messageElement.innerHTML += message;
  messageContainer.append(messageElement);
}