/* 
    Manejo de WebSocket con Socket.IO

    * En una API REST (Express), el flujo es:
        Ruta -> Controlador -> Servicio

    * En WebSockets, el flujo es:
    Evento -> Handler -> Servicio


*/
const { Server } = require('socket.io');
const { registerMessageHandlers }= require('../handlers/message.handler.js');
const { registerUserHandlers }= require('../handlers/user.handler.js');
//Repositorios
const UserRepository = require("../repositories/user.repository.js")
const MessageRepository = require('../repositories/message.repository.js');
const ConversationRepository = require('../repositories/conversation.repository.js');
const messageRepo = new MessageRepository();
const conversationRepo = new ConversationRepository();
const userRepository = new UserRepository()
//Servicios
const MessageService = require('../services/message.service.js');
const UserService = require('../services/user.service.js');
const ConversationService = require("../services/conversation.service.js");
const { registerConversationHandlers } = require('../handlers/conversion.handler.js');
//Instanciamos el servicio para poder usarlo en los handlers de sockets
const messageService = new MessageService(messageRepo, conversationRepo);
const userService = new UserService(userRepository);
const conversationService = new ConversationService(ConversationRepository);

const setupSocket = (server) => {

  //Inicializamos el servidor de sockets que se a utilizará para la comunicación en tiempo real. Le pasamos el servidor HTTP para que lo utilice 
  const io = new Server(server, {
    //Definimos el CORS para permitir conexiones desde cualquier origen
    cors: { origin: "*" } 
  });

    io.on('connection', (socket) => {
        console.log("Nuevo cliente conectado: ", socket.id);

        //Manejo de Conversacion
        registerConversationHandlers(io, socket, conversationService)
        
        //Manejo de Usuarios Conectados
        registerUserHandlers(io, socket, userService);
        
        //Manejo de mensajes
        registerMessageHandlers(io, socket, messageService);

  });

  return io;
};

module.exports = {
    setupSocket
};


/* //Inicializar socket en el servidor
    io.on("connection", (socket) =>{
        console.log("Conectados: ",connected)
        //========== Mensajes ===================
        socket.emit("chats", messages)
        //Mensaje nuevo
        socket.on('msg', (data) => {
            messages.push(data)
            io.sockets.emit("chats", messages)
        })
        
        //========= Usuarios Conectados ==============
        socket.emit("cnted", connected)
        //Usuario nuevo
        socket.on('userToConnect', (data)=>{
            //Se busca que el usuario no exista ya en el array
            const userFound = connected.find( user => user.name === data)
            //En caso de que no exista se crea uno nuevo y se agrega al array
            if (userFound === undefined){
                const newUser={
                    userSocket: socket.id,
                    name: data
                }
                connected.push(newUser)
                //Se emite el array con el usuario nuevo a todos los sockets
                io.sockets.emit("cnted", connected)
                console.log("a user connected!");
            }
            else{
                //En caso de que el usuario haya hecho una reconexión se le guarda el nuevo socket.id
                userFound.userSocket = socket.id
            }
            console.log("Conectados: ",connected)
        })
        
        //=========== Desconectar Usuarios ===============
        socket.on('disconnect', async ()=>{
            console.log("User disconeted")
            //Obtenemos las instancias sockets que están conectadas actualmente
            const sockets = await io.fetchSockets();
            //Como "fetchSockets()" nos devuelve objetos con multiples atributos, nos quedamos solamente con el socket ID
            const socketsID = sockets.map( socket  => {
                return socket.id
            })
            //Recorremos el array de conectados buscando cual socket no coincide con los sockets devueltos por el metodo "fetchSockets()"
            connected.forEach( user => {
                //Buscamos si el socket del usuario se encuentra en los sockets actuales
                const socketFound = socketsID.find(  socket => socket === user.userSocket)
                //En caso de que no exista, se elimina ese usuario. Porque es el que se desconectó
                if(socketFound === undefined){
                    connected = connected.filter(  user => user.userSocket !== socket.id)
                }

            } )
            io.sockets.emit("cnted", connected) 
            
        })
    }) */

