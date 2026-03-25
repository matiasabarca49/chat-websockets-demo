const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const { Router } = express;
const router = new Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", authUser, logoutUser);


module.exports = router;