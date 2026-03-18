const Conversation = require('../model/conversation.model.js');

async function setupGlobalChat() {
  try {
    const exists = await Conversation.findById(process.env.GLOBAL_CHAT_ID);
    
    if (!exists) {
      await Conversation.create({
        _id: process.env.GLOBAL_CHAT_ID || "69bae27ba1177b5541b2bdgh", 
        title: "CHAT_GLOBAL",
        isGroup: true,
        participants: [], // Opcional: podrías dejarlo vacío si es abierto
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