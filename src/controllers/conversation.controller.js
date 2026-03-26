const ConversationRepository = require('../repositories/conversation.repository.js');
const conversationRepo = new ConversationRepository();
const UserService = require('../services/user.service.js');
const UserRepository = require("../repositories/user.repository.js")
const userRepository = new UserRepository();
const ConversationService = require("../services/conversation.service.js");
const MessageRepository = require('../repositories/message.repository.js');
const messageRepository = new MessageRepository();
const userService = new UserService(userRepository);
const conversationService = new ConversationService(conversationRepo, userService, messageRepository);

const getAllConversation = async (req, res) =>{
    try{
        const conversations = await conversationService.getConversationByUser(req.user);
        return res.status(200).json({success: true, data: conversations});
    }catch(error){
        console.error(error);
        return res.status(200).json({success: false, message: "Error interno del servidor"});
    }
}

const deleteConversation = async (req, res) =>{
    try{
        const {conversationId} = req.params
        await conversationService.deleteConversation(conversationId);
        return res.status(200).json({success: true});
    }catch(error){
        console.error(error);
        return res.status(200).json({success: false, message: "Error interno del servidor"});
    }
}

module.exports = {
    getAllConversation,
    deleteConversation
}