const MessageService = require('../services/message.service');
const MessageRepository = require('../repositories/message.repository');
const ConversationRepository = require('../repositories/conversation.repository');
const messageRepo = new MessageRepository();
const conversationRepo = new ConversationRepository();

const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"


const messageService = new MessageService(messageRepo, conversationRepo);

// controllers/message.controller.js
const getGlobalChatHistory = async (req, res) => {
    try{
        // Llama al servicio
        const history = await messageService.getHistory(globalChat);
        res.json(history); 
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error en el Servidor"})
    }
};

const getChatHistory = async (req, res) => {
    try{
        const { chatId } = req.params;
        const {lastId } = req.query
        // Llama al servicio
        const history = await messageService.getHistory(chatId, lastId);
        res.json(history); 
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error en el Servidor"})
    }
};

module.exports = {
    getGlobalChatHistory,
    getChatHistory
};