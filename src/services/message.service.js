const { NotFoundException, NotForbidden } = require("../exceptions/exceptions.js");

const chatGlobal = process.env.GLOBAL_CHAT_ID || "GLOBAL_CHAT_ID";

// services/MessageService.js
class MessageService {
  constructor(messageRepo, conversationRepo) {
    this.messageRepo = messageRepo;
    this.conversationRepo = conversationRepo;
  }

  async sendMessage(senderId, conversationId, content) {
    //Validar que la conversación existe y el usuario es parte de ella
    const conversation = await this.conversationRepo.findByConversationId(conversationId);
    
    if (!conversation) throw new NotFoundException("Conversacion", "id", conversationId);
    
    if(conversationId !== chatGlobal) {
      
      const isParticipant = conversation.participants.some(participant => participant._id.toString() === senderId);
  
      if (!isParticipant) throw new NotForbidden("No puedes enviar mensajes a una conversación de la que no eres parte");
    }
  
    //Persistir
    const message = await this.messageRepo.create({
      senderId,
      conversationId,
      content
    });

    return message;
  }

  async getHistory(conversationId, lastId){
      const conversation = await this.conversationRepo.existsByConversationId(conversationId);
      if (!conversation) throw new NotFoundException("Conversacion", "id", conversationId);
      return await this.messageRepo.findByConversation(conversationId, lastId);
  }

  async deleteAllMessage(conversationId){
    const conversation = await this.conversationRepo.existsByConversationId(conversationId);
    if (!conversation) throw new NotFoundException("Conversacion", "id", conversationId);
    return this.messageRepo.deleteAllMessage(conversationId);
  }


}

module.exports = MessageService;