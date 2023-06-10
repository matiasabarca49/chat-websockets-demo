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
    //Mensajes
    socket.on('msg', (data) => {
        messages.push(data)
        /* console.log(messages) */
        io.sockets.emit("chats", messages)
    })
    socket.emit("chats", messages)
    //Usuarios Conectados
    socket.emit("cnted", connected)
    socket.on('userToConnect', (data)=>{
        console.log("Usuario a conectar:", data)
        const newUser={
            userSocket: socket.id,
            name: data
        }
        const userFound = connected.find( user => user.name === data)
        if (userFound === undefined){
            connected.push(newUser)
            io.sockets.emit("cnted", connected)
            console.log("a user connected!");
        }
        else{
            userFound.userSocket = socket.id
        }
        console.log("Conectados: ",connected)
    })
    /* console.log(messages) */
    
    //Desconectar Usuarios
    socket.on('disconnect', async ()=>{
        console.log("User disconeted")
        const sockets = await io.fetchSockets();
        /* sockets.forEach( socket =>{
            const socketFound = connected.find(connected => connected.userSocket === socket.id)
            console.log("Socket encontrado: ",socketFound)
            console.log("socket id: ", socket.id)
            if(socketFound === undefined){
                connected = connected.filter(  user => user.userSocket !== socket.id)
            }
        }) */
        const socketsID = sockets.map( socket  => {
            return socket.id
        })
        connected.forEach( user => {
            const socketFound = socketsID.find(  socket => socket === user.userSocket)
            console.log(socketFound)
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