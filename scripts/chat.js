'use strict';
let socket = io.connect('/');

let messageContainer = document.querySelector('.message-container');
let messageForm = document.querySelector('.message-block');
let messageInput = document.querySelector('#message-input');

socket.on('chat-message', data => {
  console.log(data);
  appendMessage(data);
});

messageForm.addEventListener('click', e => {
  e.preventDefault();
  let message = messageInput.value;
  socket.emit('send-message', message);
  messageInput.value = "";
});

function appendMessage(message) {
  let messageElement = document.createElement('div');
  messageElement.innerHTML += message;
  messageContainer.append(messageElement);
}