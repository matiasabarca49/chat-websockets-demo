const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(__dirname+'/public'));

//Handleblars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//Routes
const homeRouter = require("./routes/chat.router.js")
const messageRouter = require("./routes/message.router.js")
const userRouter = require("./routes/user.router.js")

app.use("/", homeRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/users", userRouter);


module.exports = app;