// sockets/chatHandler.js
const registerConversationHandlers = (io, socket, conversionService) => {
  
    socket.join(process.env.GLOBAL_CHAT_ID);
    console.log(`Socket ${socket.id} se unió al chat global: ${process.env.GLOBAL_CHAT_ID}`);
  
};

module.exports = { 
    registerConversationHandlers
};