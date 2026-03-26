const express = require("express");
const { Router } = express;
const router = new Router()
const { getGlobalChatHistory, getChatHistory } = require("../controllers/message.controller");


router.get("/global", getGlobalChatHistory);
router.get("/conversation/:chatId", getChatHistory);



module.exports = router;