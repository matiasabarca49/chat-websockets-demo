const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID";


const registerUserHandlers = async (io, socket, userService) => {
  // Aquí irían los eventos relacionados con usuarios
  
    socket.on("connect_to_global", async (data) => {
        const {id} = data// Extraído previamente del handshake/token
        const user = await userService.connectUser(id, socket.id);

        //Emitir al nuevo que se acaba de conectar
        const users = await userService.getConnectedUsers();
        socket.emit("cnted", users); // Emitir la lista de usuarios conectados al nuevo cliente

        //Emitir a los ya conectados el nuevo cliente excepto al cliente
        socket.to(globalChat).emit("new_connected_global", {message: "Usuario conectado exitosamente", data: user});
    })


    // ESCUCHADOR DE DESCONEXIÓN
    socket.on("disconnect", async (reason) => {
        console.log(`Usuario ${socket.id} se fue. Motivo: ${reason}`);

        const userId = userService.getUserIdBySocketId(socket.id);

        /* console.log("UserIDEncontrado: ", userId); */

        if (userId) {
            userService.disconnectUser(userId);

            const updatedUsers = await userService.getConnectedUsers();
            io.to(globalChat).emit("cnted", updatedUsers);
        }
    });



}

module.exports = {
    registerUserHandlers
};