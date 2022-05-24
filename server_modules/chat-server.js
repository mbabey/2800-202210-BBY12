'use strict';

module.exports = {
  runChatServer: (io) => {
    io.on('connect', socket => {
      const connectedUsers = [];

      console.log('New user joined chat: \n', socket.id);
      
      socket.emit('chat-message', 'Chat up a collab!');
      
      socket.on('send-message', (message) => {
        console.log(message);
        socket.emit('chat-message', message);
      });

      socket.on('new-connection', (user) => {
        // Store user info.
        connectedUsers.push({ username: user, userId: socket.id });
        // Send message about user joining.
        const userJoinMessage = user + ' has joined the collab!';
        socket.emit('chat-message', userJoinMessage);
      });
    });
  }
}
