const mongose = require('mongoose');

// models/User.js
const userSchema = new mongose.Schema({
  name: {
    type: String,
    default: "Usuario"
  },
  lastName: {
    type: String,
    default: " - "
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
}, { timestamps: true });

module.exports = mongose.model('User', userSchema);