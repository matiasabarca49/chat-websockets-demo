const { DuplicateEntryException } = require("../exceptions/validations.exception");
const Conversation = require("../model/conversation.model");

class ConversationRepository{
    async create(conversationData){

        try{
            //Crear la conversación en la base de datos
            const conversation = await Conversation.create(conversationData);
            //Poblar los datos de los participantes para devolverlos al cliente
            await conversation.populate('participants', 'name lastName username');
    
            return conversation;

        } catch(err){

            //Manejo de error de clave duplicada para evitar crear conversaciones 1a1 duplicadas
            if(err.code === 11000){
                throw new DuplicateEntryException("Conversación", "conversationId", conversationData.conversationId);
            }else{
                throw err;
            }

        };

    }

    async findByConversationId(id){
        return await Conversation.findOne({ conversationId: id })
        .populate('participants', 'name lastName username').lean();
    }

    async findByUser(userId){
        return await Conversation.find({ participants: userId })
        .populate('participants', 'name lastName username').lean();
    }

    async findById(conversationId){
        return await Conversation.findById(conversationId)
        .populate('participants', 'username').lean();
    }

    async existsByConversationId(conversationId){
        return await Conversation.exists({ conversationId })
    }

    async deleteConversation(conversationId){
        return await Conversation.deleteOne({conversationId})
    }
}

module.exports = ConversationRepository;