const mongoose = require('mongoose');

// models/Conversation.js
const conversationSchema = new mongoose.Schema(
    {
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [
        {   
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
  isGroup: { 
    type: Boolean, 
    default: false 
},
  name: { 
    type: String 
},
description: {
  type: String
}
,// Solo para grupos
admin: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User' }, // Solo para grupos
}, 
//Opciones
{ timestamps: true });
module.exports = mongoose.model('Conversation', conversationSchema);