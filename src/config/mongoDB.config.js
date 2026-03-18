const mongoose = require("mongoose");

class MongoManager {
    async connect(){
        return mongoose.connect("mongodb://localhost:27017/chat");
    }
}

module.exports = MongoManager;
