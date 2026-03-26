const Conversation = require("../model/conversation.model");

class ConversationRepository{
    async create(conversationData){
        return await Conversation.create(conversationData);
    }

    async findByConversationId(id){
        return await Conversation.findOne({ conversationId: id })
        .populate('participants', 'name lastName username');
    }

    async findByUser(userId){
        return await Conversation.find({ participants: userId })
        .populate('participants', 'name lastName username');
    }

    async findById(conversationId){
        return await Conversation.findById(conversationId)
        .populate('participants', 'username');
    }

    async deleteConversation(conversationId){
        return await Conversation.deleteOne({conversationId})
    }
}

module.exports = ConversationRepository;