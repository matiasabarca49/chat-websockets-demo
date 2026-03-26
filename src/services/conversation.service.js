// services/ConversationService.js
class ConversationService {
    constructor(repo, userService, repoMessage) {
        this.repoConversation = repo;
        this.repoMessage =repoMessage;
        this.userService = userService;
    }

  getSocketByUser(userId){
    return this.userService.getSocketByUser(userId);
  }

  getUserBySocket(socketID){
    return this.userService.getUserIdBySocketId(socketID);
  }

  async getConversationByUser(user){
    const conversations =  await this.repoConversation.findByUser(user.id);
    const conversationsFiltered = conversations.map( conversation => {
      if(!conversation.isGroup){
        const participants = conversation.participants;
        const target = participants.filter(participant => participant._id.toString() !== user.id);
        conversation.participants = target;
      }
      return conversation;
    })
    return conversationsFiltered;
  }

  async createPrivateChat(userA, userB) {
    //Creamos el ConversionId. Se ordena para siempre creal el mismo sin importar quien sea A y B
    const conversationId = [userA, userB].sort().join('-')
    //Lógica para evitar duplicados: Si ya existe un chat 1a1 entre ellos, devolver ese.
    let conversation = await this.repoConversation.findByConversationId(conversationId);
    if (!conversation) {
      conversation = await this.repoConversation.create({conversationId: conversationId,participants: [userA, userB], isGroup: false });
    }
    //Retornamos solo el receptor
    conversation = await this.repoConversation.findByConversationId(conversationId);

    return conversation;
  }

  async deleteConversation(conversationId){
    //Borrar los mensajes de la conversacion
    await this.repoMessage.deleteAllMessage(conversationId);
    //Borrar la conversacion
    await this.repoConversation.deleteConversation(conversationId);
    return;
  }

}

module.exports = ConversationService;