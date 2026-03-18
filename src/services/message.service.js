// services/MessageService.js
class MessageService {
  constructor(messageRepo, conversationRepo) {
    this.messageRepo = messageRepo;
    this.conversationRepo = conversationRepo;
  }

  async sendMessage(senderId, conversationId, content) {
    //Validar que la conversación existe y el usuario es parte de ella
    const conversation = await this.conversationRepo.findById(conversationId);
    console.log("Conversation ID: ", conversation);
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

  async getGlobalHistory(){
      return this.messageRepo.findByConversation( process.env.GLOBAL_CHAT_ID || "69bae27ba1177b5541b2bdcf");
      
  }


}

module.exports = MessageService;