const express = require("express");
const { Router } = express;
const router = new Router()
const { getGlobalChatHistory } = require("../controllers/message.controller");


router.get("/global", getGlobalChatHistory);


module.exports = router;