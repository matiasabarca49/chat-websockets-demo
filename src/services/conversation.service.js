// services/ConversationService.js
class ConversationService {
    constructor(repo) {
        this.repo = repo;
    }

  async createPrivateChat(userA, userB) {
    //Lógica para evitar duplicados: Si ya existe un chat 1a1 entre ellos, devolver ese.
    let conversation = await this.repo.findPrivate(userA, userB);
    if (!conversation) {
      conversation = await this.repo.create({ participants: [userA, userB], isGroup: false });
    }
    return conversation;
  }
}

module.exports = ConversationService;