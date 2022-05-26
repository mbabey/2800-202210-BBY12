'use strict';

const connectedUsers = [];

module.exports = {
  runChatServer: (io) => {
    io.on('connect', socket => {

      console.log('New user joined chat: ', socket.id);

      socket.emit('chat-message', 'Chat up a collab!');

      // Catch messages that are coming from a client and send them to all clients.
      socket.on('send-message', (message, user) => {
        //check message
        if (message)
          io.emit('chat-message', message, user);
      });

      socket.on('new-connection', (user) => {
        // Store user info.
        connectedUsers[socket.id] = user;

        // Send message about user joining.
        const userJoinMessage = user + ' has joined the collab!';
        socket.emit('chat-message', userJoinMessage);
      });

      socket.on('disconnect', (reason) => {
        console.log(reason);
        delete connectedUsers[socket.id];
      });
    });
  }
};
