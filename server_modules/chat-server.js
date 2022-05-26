'use strict';

module.exports = {
  runChatServer: (io, currentUser) => {
    io.on('connect', socket => {
      const connectedUsers = [];

      console.log('New user joined chat: ', socket.id);
      
      socket.emit('chat-message', 'Chat up a collab!');
      
      // Catch messages that are coming from a client and send them to all clients.
      socket.on('send-message', (message) => {
        socket.emit('chat-message', message);
      });

      socket.on('new-connection', (user) => {
        // Store user info.
        connectedUsers.push({ username: user, userId: socket.id });
        socket.emit('users', connectedUsers);
        
        // Send message about user joining.
        const userJoinMessage = user + ' has joined the collab!';
        socket.emit('chat-message', userJoinMessage);
      });
    });
  }
}
