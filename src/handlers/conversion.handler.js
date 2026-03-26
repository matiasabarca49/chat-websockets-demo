const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"

// sockets/chatHandler.js
const registerConversationHandlers = (io, socket, conversationService) => {
  
    socket.join(globalChat);
    
    console.log(`Socket ${socket.id} se unió al chat global: ${globalChat}`);

    socket.on("connect_to_private", async (data) =>{
        //1 - Obtener usuario actual con su socket
        const userCurrent = await conversationService.getUserBySocket(socket.id);
        //2 - Obtener usuario con el que se quiere conectar y su socket
        const socketRecipient = conversationService.getSocketByUser(data._id);
        //3 - Crear Conversacion con esos usuarios.
        const conversation = await conversationService.createPrivateChat(userCurrent, data._id);


        //Ingresar al usuario que creo el chat(Emisor)
        socket.join(conversation.conversationId);

        socket.to(socketRecipient).emit("available_conversation", conversation)

        //Emitir al receptor

        socket.to
    })

    socket.on("join_to_conversation",(data) =>{
        console.log("Room: ", data)
        socket.join(data);
    })
};

module.exports = { 
    registerConversationHandlers
};