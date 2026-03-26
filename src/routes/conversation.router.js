const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const { getAllConversation, deleteConversation } = require('../controllers/conversation.controller');
const { Router } = express;
const router = new Router;


router.get("/", authUser, getAllConversation);
router.delete("/:conversationId", authUser, deleteConversation);

module.exports = router