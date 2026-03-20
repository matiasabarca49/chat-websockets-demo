const mongoose = require("mongoose");

class MongoManager {
    async connect(){
        try{
            await mongoose.connect("mongodb://localhost:27017/chat");
            console.log("✅ - Conexión a DB Exitosa");
        }
        catch(error){
            console.error("❌ - Error al conectar Base de Datos");
            process.exit(1);
        }
    }
}

module.exports = MongoManager;
