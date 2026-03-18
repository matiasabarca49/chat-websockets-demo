const registerUserHandlers = (io, socket, userService) => {
  // Aquí irían los eventos relacionados con usuarios
  
    socket.on("userToConnect", async (data) => {
        const {_id} = data// Extraído previamente del handshake/token
        const user = await userService.connectUser(_id, socket.id);
        socket.emit("connected", {message: "Usuario conectado exitosamente", data: user});
    })

    socket.emit("cnted", userService.getConnectedUsers()) // Emitir la lista de usuarios conectados al nuevo cliente
}

module.exports = {
    registerUserHandlers
};