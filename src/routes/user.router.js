const express = require("express");
const { Router } = express;
const router = new Router();
const { createUser, getAllUsers } = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/", authUser, getAllUsers);
router.post("/", authUser, createUser);


module.exports = router;