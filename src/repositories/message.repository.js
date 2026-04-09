const Message = require('../model/message.model.js');

class MessageRepository {
  async create(messageData) {
    const newMessage = await Message.create(messageData);
    return await newMessage.populate('senderId', 'username');
  }

  async findByID(id){
    return await Message.find({_id: id});
  }

  async existsByConversationId(conversationId){
    return await Message.exists({conversationId});
  }
  
  async findByConversation(conversationId, lastId = null, limit = 30) {
      const query = { conversationId: conversationId };

      // Si el front nos manda un ID, buscamos los mensajes ANTERIORES a ese
      if (lastId) {
          query._id = { $lt: lastId }; 
      }

      const messages = await Message.find(query)
          .sort({ _id: -1, timestamp: -1 }) // Del más nuevo al más viejo
          .limit(limit)
          .populate('senderId', 'username');

      // Si trajo 30, es que "posiblemente" hay más
      const hasMore = messages.length === limit;

      return {messages: messages.reverse(), hasMore: hasMore};
    }

    async deleteAllMessage(conversationId){
      return await Message.deleteMany({conversationId});
    }
  }

module.exports = MessageRepository;