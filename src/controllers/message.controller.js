const MessageService = require('../services/message.service');
const MessageRepository = require('../repositories/message.repository');
const ConversationRepository = require('../repositories/conversation.repository');
const messageRepo = new MessageRepository();
const conversationRepo = new ConversationRepository();

const globalChat = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID"


const messageService = new MessageService(messageRepo, conversationRepo);

// controllers/message.controller.js
const getGlobalChatHistory = async (req, res, next) => {
    try{
        // Llama al servicio
        const history = await messageService.getHistory(globalChat);
        res.json(history); 
    }catch(error){
        next(error);
    }
};

const getChatHistory = async (req, res, next) => {
    try{
        const { conversationId } = req.params;
        const {lastId } = req.query
        // Llama al servicio
        const history = await messageService.getHistory(conversationId, lastId);
        res.json(history); 
    }catch(error){
        next(error);
    }
};

module.exports = {
    getGlobalChatHistory,
    getChatHistory
};