const globalChat = process.env.GLOBAL_CHAT_ID || "69bae27ba1177b5541b2bdcf"

// sockets/chatHandler.js
const registerConversationHandlers = (io, socket, conversionService) => {
  
    socket.join(globalChat);
    
    console.log(`Socket ${socket.id} se unió al chat global: ${globalChat}`);

    /* const socketsGlobal = io.sockets.adapter.rooms.get(process.env.GLOBAL_CHAT_ID || "69bae27ba1177b5541b2bdcf");

    console.log("Sockets Globales: ", socketsGlobal); */
};

module.exports = { 
    registerConversationHandlers
};