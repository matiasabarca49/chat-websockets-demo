const MessageService = require('../services/message.service');
const MessageRepository = require('../repositories/message.repository');
const ConversationRepository = require('../repositories/conversation.repository');
const messageRepo = new MessageRepository();
const conversationRepo = new ConversationRepository();


const messageService = new MessageService(messageRepo, conversationRepo);

// controllers/message.controller.js
const getGlobalChatHistory = async (req, res) => {
    try{
        // Llama al servicio
        const history = await messageService.getGlobalHistory();
        res.json(history); 
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error en el Servidor"})
    }
};

const getChatHistory = async (req, res) => {
    const { chatId } = req.params;
    // Llama al servicio
    const history = await messageService.getHistory(chatId);
    res.json(history); 
};

module.exports = {
    getGlobalChatHistory,
    getChatHistory
};