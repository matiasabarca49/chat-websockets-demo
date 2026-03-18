const express = require("express");
const { Router } = express;
const router = new Router();
const { createUser } = require("../controllers/user.controller");


router.post("/", createUser);


module.exports = router;