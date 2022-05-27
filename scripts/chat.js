'use strict';

docLoaded(() => {
  let thisUser;
  const socket = io.connect('/');
  const messageContainer = document.querySelector('#message-content');
  const messageSendButton = document.querySelector('#message-submit');
  const messageInput = document.querySelector('#message-input');

  getThisUser();

  // Catch messages coming from the server and display it on the DOM.
  socket.on('chat-message', (message, user) => {
    addMessage(message, user);
  });

  // Send messages to the server by pressing the send button.
  messageSendButton.addEventListener('click', e => {
    e.preventDefault();
    let message = messageInput.value.trim();
    socket.emit('send-message', message, thisUser);
    messageInput.value = "";
  });

  // Disconnect when the path changes.
  socket.on('disconnect', () => {
    socket.disconnect();
  });

  /**
   * getThisUser. Retreives user data from server.
   */
  async function getThisUser() {
    await getData('/get-user', (results) => {
      thisUser = results[0].username;
      socket.emit('new-connection', thisUser);
    });
  }

  /**
   * addMessage. Builds and add the DOM for a message.
   * @param {string} message - Message to display
   * @param {string} user - User that sent message
   */
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
    if (user === undefined) {
      messageBlock.classList.add('server-message');
    } else if (thisUser === user) {
      messageBlock.classList.add('self-message');
    } else {
      messageBlock.classList.add('other-message');
    }
    messageContainer.append(messageBlock);
    scrollToBottom();
  }

  /**
   * scrollToBottom. Scrolls to the bottom of the chat container if chat messages overflow their container.
   */
  function scrollToBottom() {
    let shouldScroll = messageContainer.scrollTop + messageContainer.clientHeight === messageContainer.scrollHeight;
    if (!shouldScroll) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }
});

/**
 * docLoaded. Runs a callback function when the web page is loaded.
 * @param {function} action - the function to run when the DOM is loaded.
 */
function docLoaded(action) {
  if (document.readyState != 'loading')
    action();
  else
    document.addEventListener('DOMContentLoaded', action);
}

/**
 * getData. Retrieve information from a specified path and then 
 * execute a callback with that information.
 * @param {String} path - the get path to server
 * @param {function} callback - the callback function to run
 */
async function getData(path, callback) {
  try {
    let response = await fetch(path, {
      method: 'GET'
    });
    response = await response.text();
    response = JSON.parse(response);
    callback(response);
  } catch (err) {
  }
}
