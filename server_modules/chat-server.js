'use strict';

/** Stores the users connected to the chat server. */
const connectedUsers = [];

module.exports = {
  /**
   * runChatServer. Starts the chat server and listens for and responds to socket events on the serverside. 
   * @param {io} io - the chat server
   */
  runChatServer: (io) => {
    io.on('connect', socket => {
      socket.emit('chat-message', 'Chat up a collab!');

      // Catch messages that are coming from a client and send them to all clients.
      socket.on('send-message', (message, user) => {
        if (message)
          io.emit('chat-message', message, user);
      });

      // Catch new connections and print a joined message to all users.
      socket.on('new-connection', (user) => {
        connectedUsers[socket.id] = user;
        const userJoinMessage = user + ' has joined the collab!';
        socket.emit('chat-message', userJoinMessage);
      });

      // Catch a disconnect and remove the disconnected user from the list of connected users.
      socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
      });
    });
  }
};
