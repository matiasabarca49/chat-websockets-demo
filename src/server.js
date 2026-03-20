require("dotenv").config();
const http = require('http');
const app  = require('./app');
const { setupSocket } = require('./config/sockets.config.js');
const { setupGlobalChat } = require("./config/starts.config.js")
//DB
const MongoManager = require("./config/mongoDB.config.js")
const mongoManager = new MongoManager();

const startServer = async () =>{

  // Crear el servidor HTTP utilizando la aplicación Express
  const server = http.createServer(app);
  
  // Inicializamos los Sockets pasando el servidor HTTP
  setupSocket(server);
  
  //Conectar DBMongo
  await mongoManager.connect();
  
  //Creamos el chat global
  await setupGlobalChat();
  
  const PORT = process.env.PORT || 8080;
  
  server.listen(PORT, () => {
    console.log("-".repeat(50));
    console.log(`🟢 - Servidor corriendo en el puerto ${PORT}`);
    console.log('━'.repeat(50));
  });
}

startServer();
