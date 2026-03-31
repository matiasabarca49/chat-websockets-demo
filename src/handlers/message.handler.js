const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"

// sockets/chatHandler.js
const registerMessageHandlers = (io, socket, messageService) => {

  socket.on("send_message", async (data) => {
    try {
      const {senderId, conversationId, content } = data;

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