class UserService {
    constructor(repository) {
        //Guardar socketID:userID para saber quién está conectado
        this.connectedUsers = new Map(); // Map para almacenar usuarios conectados
        this.repository = repository;
    }

    async connectUser(userId, socketId) {
        this.connectedUsers.set(userId, socketId);
        const user = await this.repository.findById(userId);
        return {...user, socketId};
    }

   async getConnectedUsers() {
        const ids = Array.from(this.connectedUsers.keys());

        const users = await this.repository.findByFilter({_id: {$in: ids}});

        const allUser = users.map( user => {
            return {...user, socketId: this.connectedUsers.get(user._id.toString())}
        })

        return allUser;
    } 

    getUserIdBySocketId(socketIdUser){
        console.log(socketIdUser);
        for( let [userId, socketId] of this.connectedUsers.entries()){
            /* console.log("UserID ", userId);
            console.log("socketId ", socketId); */
            if(socketId === socketIdUser){
                return userId
            }
        }

        return false;
    }

    disconnectUser(userId) {
        console.log(`Usuario ${userId} desconectado`);
        this.connectedUsers.delete(userId);
    }

    async create(user){
        return this.repository.create(user);
    }

}

module.exports = UserService;