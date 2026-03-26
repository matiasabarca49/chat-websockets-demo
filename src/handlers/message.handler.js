const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"

// sockets/chatHandler.js
const registerMessageHandlers = (io, socket, messageService) => {

  socket.on("send_message", async (data) => {
    try {
      const {senderId, conversationId, content } = data;
      /* const userId = socket.userId; */ // Extraído previamente del handshake/token

      const newMessage = await messageService.sendMessage(senderId, conversationId, content);

      console.log("Emití el mensaje en la room: ", conversationId);
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