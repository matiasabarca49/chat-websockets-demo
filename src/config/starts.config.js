const Conversation = require('../model/conversation.model.js');

async function setupGlobalChat() {
  try {
    const exists = await Conversation.find({conversationId: process.env.GLOBAL_CHAT_ID});
    
    if (!exists.length) {
      await Conversation.create({
        conversationId: process.env.GLOBAL_CHAT_ID || "CHAT_GLOBAL_ID", 
        title: "CHAT_GLOBAL",
        isGroup: true,
        participants: [],
        description: "Canal público para todos los usuarios"
      });
      console.log("✅ Chat Global creado con éxito.");
    }
  } catch (error) {
    console.error("❌ Error al configurar el Chat Global:", error);
  }
}

module.exports = {
    setupGlobalChat
}