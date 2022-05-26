'use strict';

const messageContainer = document.querySelector('#message-content');
const messageSendButton = document.querySelector('#message-submit');
const messageInput = document.querySelector('#message-input');

const socket = io.connect('/');

socket.onAny((event, ...args) => {
  console.log(event, args);
});

let thisUser;

getThisUser();

async function getThisUser() {
  await getData('/get-user', (results) => {
    thisUser = results[0].username;
    socket.emit('new-connection', thisUser);
  });
}

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

// Catch messages coming from the server and display it on the DOM.
// user is the sender of the message.
socket.on('chat-message', (data, user) => {
  addMessage(data, user);
});

// Send messages to the server by pressing the send button.
messageSendButton.addEventListener('click', e => {
  e.preventDefault();
  let message = messageInput.value;
  socket.emit('send-message', message, thisUser);
  console.log(message, thisUser);
  messageInput.value = "";
});

// Builds the DOM for a message.
function addMessage(message, user) {
  let messageElement = document.createElement("div");
  messageElement.classList.add('message');
  messageElement.innerHTML += message;

  console.log(thisUser, user);
  if (thisUser === user) {
    messageElement.classList.add('self-message');
  } else {
    messageElement.classList.add('other-message');
  }

  messageContainer.append(messageElement);
}

// Disconnects when path changes.
socket.on('disconnect', () => {
  socket.disconnect();
});
