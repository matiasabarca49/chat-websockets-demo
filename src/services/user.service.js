class UserService {
    constructor(repository) {
        //Guardar socketID:userID para saber quién está conectado
        this.connectedUsers = new Map(); // Map para almacenar usuarios conectados
        this.repository = repository;
    }

    async connectUser(userId, socketId) {
        this.connectedUsers.set(userId, socketId);
        return {message: "Usuario conectado exitosamente", user: {id: userId, socketId}};
    }

    getConnectedUsers() {
        // Aquí iría la lógica para obtener los usuarios conectados
        return Array.from(this.connectedUsers.entries()).map(([userId, socketId]) => ({userId, socketId}));
    }

    async disconnectUser(userId) {
        // Aquí iría la lógica para marcar al usuario como desconectado
        console.log(`Usuario ${userId} desconectado`);
        this.connectedUsers.delete(userId);
    }

    async create(user){
        return this.repository.create(user);
    }

}

module.exports = UserService;