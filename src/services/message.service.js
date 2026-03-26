// services/MessageService.js
class MessageService {
  constructor(messageRepo, conversationRepo) {
    this.messageRepo = messageRepo;
    this.conversationRepo = conversationRepo;
  }

  async sendMessage(senderId, conversationId, content) {
    //Validar que la conversación existe y el usuario es parte de ella
    const conversation = await this.conversationRepo.findByConversationId(conversationId);
    /* console.log("Conversation ID: ", conversation); */
    if (!conversation) throw new Error("Conversación no encontrada");
    
    /* const isParticipant = conversation.participants.includes(senderId);
    if (!isParticipant) throw new Error("No tienes permiso en este chat");
 */
  
    //Persistir
    const message = await this.messageRepo.create({
      senderId,
      conversationId,
      content
    });

    return message;
  }

  async getHistory(chatId){
      return await this.messageRepo.findByConversation(chatId);
  }

  async deleteAllMessage(conversationId){
    return this.messageRepo.deleteAllMessage(converstationId);
  }


}

module.exports = MessageService;