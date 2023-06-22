const express = require('express')
const http = require('http')
const handlebars = require('express-handlebars')

const messages = []
let connected= []

const app = express()

app.use(express.static(__dirname+'/public'))

const server = http.createServer(app)

//socket en servidor
const {Server} = require("socket.io")
const io = new Server(server)

//Inicializar socket en el servidor
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
})

//Handleblars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


//Routes
const homeRouter = require("./routes/chat.router")
app.use("/chat", homeRouter)

//EndPoints
app.use("/", (req,res) => {
    res.send(`<h1> Data desde el back-End </h1>`)
})








server.listen(8080, () => {
    console.log("The server is running in port 8080")
})