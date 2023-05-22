const express = require('express')
const http = require('http')
const handlebars = require('express-handlebars')

const messages = []

const app = express()

app.use(express.static(__dirname+'/public'))

const server = http.createServer(app)

//socket en servidor
const {Server} = require("socket.io")
const io = new Server(server)

//Inicializar socket en el servidor
io.on("connection", (socket) =>{
    socket.on('msg', (data) => {
        messages.push(data)
        io.sockets.emit("chats", messages)
    })
    socket.emit("chats", messages)
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