'use strict';

docLoaded(() => {
  let thisUser;
  const socket = io.connect('/');
  const messageContainer = document.querySelector('#message-content');
  const messageSendButton = document.querySelector('#message-submit');
  const messageInput = document.querySelector('#message-input');

  getThisUser();
  async function getThisUser() {
    await getData('/get-user', (results) => {
      thisUser = results[0].username;
      socket.emit('new-connection', thisUser);
    });
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
    let messageBlock = document.createElement('div');
    let usernameElement = document.createElement('div');
    usernameElement.classList.add('sender-name');
    usernameElement.innerHTML += user;
    let messageElement = document.createElement("div");
    messageElement.classList.add('message');
    messageElement.innerHTML += message;

    messageBlock.appendChild(usernameElement);
    messageBlock.appendChild(messageElement);

    console.log(thisUser, user);
    if (user === undefined) {
      messageBlock.classList.add('server-message');
    } else if (thisUser === user) {
      messageBlock.classList.add('self-message');
    } else {
      messageBlock.classList.add('other-message');
    }

    messageContainer.append(messageBlock);
  }

  // Disconnects when path changes.
  socket.on('disconnect', () => {
    socket.disconnect();
  });
});

function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
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

