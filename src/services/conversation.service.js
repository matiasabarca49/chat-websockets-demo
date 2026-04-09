const { NotFoundException } = require("../exceptions/exceptions.js");

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
    if(!conversations){
      throw new NotFoundException("Conversaciones", "usuario", user.id);
    };

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

    //Verificar que los usuarios existan



    //Creamos el ConversionId. Se ordena para siempre creal el mismo sin importar quien sea A y B
    const conversationId = [userA, userB].sort().join('-')

    //Lógica para evitar duplicados: Si ya existe un chat 1a1 entre ellos, devolver ese.
    /* let conversation = await this.repoConversation.findByConversationId(conversationId); */
    let conversation = await this.repoConversation.existsByConversationId(conversationId);

    if (!conversation) {

      conversation = await this.repoConversation.create({conversationId: conversationId,participants: [userA, userB], isGroup: false });
    }else{

      conversation = await this.repoConversation.findByConversationId(conversationId);
    }    
    //Retornamos la conversacion creada o encontrada
    return conversation;
  }

  async deleteConversation(conversationId){
    const conversation = await this.repoConversation.existsByConversationId(conversationId);

    if(!conversation){
      throw new NotFoundException("Conversacion", "id", conversationId);
    }
    
    //Borrar los mensajes de la conversacion
    await this.repoMessage.deleteAllMessage(conversationId);
    //Borrar la conversacion
    await this.repoConversation.deleteConversation(conversationId);
    return;
  }

}

module.exports = ConversationService;