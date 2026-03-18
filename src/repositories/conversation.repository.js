const Conversation = require("../model/conversation.model");

class ConversationRepository{
    async create(conversationData){
        return await Conversation.create(conversationData);
    }

    async findByUser(userId){
        return await Conversation.find({ participants: userId })
        .populate('participants', 'username');
    }

    async findById(conversationId){
        return await Conversation.findById(conversationId)
        .populate('participants', 'username');
    }
}

module.exports = ConversationRepository;