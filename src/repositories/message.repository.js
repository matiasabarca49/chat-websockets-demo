const Message = require('../model/message.model.js');

class MessageRepository {
  async create(messageData) {
    const newMessage = await Message.create(messageData)
    return await newMessage.populate('senderId', 'username');
  }

  async findByID(id){
    return await Message.find({_id: id});
  }

  async findByConversation(conversationId, limit = 50) {
    return await Message.find({ conversationId: conversationId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('senderId', 'username');
  }

  async deleteAllMessage(conversationId){
    return await Message.deleteMany({conversationId});
  }
}

module.exports = MessageRepository;