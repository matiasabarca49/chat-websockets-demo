// sockets/chatHandler.js
const registerMessageHandlers = (io, socket, messageService) => {
  
  socket.on("send_global_message", async (data) => {
    try {
      const {senderId, content } = data;

      conversationId = process.env.GLOBAL_CHAT_ID || "69bae27ba1177b5541b2bdcf";
      /* const userId = socket.userId; */ // Extraído previamente del handshake/token

      // El Service hace el trabajo sucio
      const newMessage = await messageService.sendMessage(senderId, conversationId, content);

      // Emitimos a la room de la conversación
     io.to(conversationId).emit("new_global_message", newMessage);
      
    } catch (error) {
      socket.emit("error_message", { msg: error.message });
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const {senderId, conversationId, content } = data;
      /* const userId = socket.userId; */ // Extraído previamente del handshake/token

      // El Service hace el trabajo sucio
      const newMessage = await messageService.sendMessage(senderId, conversationId, content);

      // Emitimos a la room de la conversación
     io.to(conversationId).emit("new_message", newMessage);
      
    } catch (error) {
      socket.emit("error_message", { msg: error.message });
    }
  });
};

module.exports = { 
    registerMessageHandlers
};