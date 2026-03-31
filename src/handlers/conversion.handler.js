const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"

// sockets/chatHandler.js
const registerConversationHandlers = (io, socket, conversationService) => {
  
    socket.join(globalChat);
    console.log(`Socket ${socket.id} se unió al chat global: ${globalChat}`);

    socket.on("connect_to_private", async (data) =>{
        //1 - Obtener usuario actual con su socket
        const userCurrent = conversationService.getUserBySocket(socket.id);
        //2 - Obtener usuario con el que se quiere conectar y su socket
        const socketRecipient = conversationService.getSocketByUser(data._id);
        //3 - Crear Conversacion con esos usuarios.
        const conversation = await conversationService.createPrivateChat(userCurrent, data._id);


        //Ingresar el usuario que creo el chat(Emisor) en la conversacion
        socket.join(conversation.conversationId);

        //Ingresar el usuario destinatario en la conversacion
        const recipientSocket = io.sockets.sockets.get(socketRecipient);
        if (recipientSocket) {
            recipientSocket.join(conversation.conversationId);
        }

        //Emitir al emisor la conversacion creada
        socket.to(socketRecipient).emit("available_conversation", conversation)

        
    })

    socket.on("join_to_conversation", (data) =>{
        console.log("Room: ", data)
        socket.join(data);
    })

    socket.on("join_to_conversations", async ()=>{
        //Ingresar al usuario a todos sus chats
        const userCurrent = conversationService.getUserBySocket(socket.id);
        const conversations = await conversationService.getConversationByUser({id: userCurrent});
        conversations.forEach(conversation => {
            socket.join(conversation.conversationId);
        });
    })
};

module.exports = { 
    registerConversationHandlers
};