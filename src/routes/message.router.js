const express = require("express");
const { Router } = express;
const router = new Router()
const { getGlobalChatHistory, getChatHistory } = require("../controllers/message.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/conversation/:conversationId", authUser, getChatHistory);

module.exports = router;