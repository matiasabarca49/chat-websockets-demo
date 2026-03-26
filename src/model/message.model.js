const mongoose = require('mongoose');

// models/Message.js
const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: String
},
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  content: { 
    type: String, 
    required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);