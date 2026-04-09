const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller.js');
const { authUser, checkAuth } = require('../middlewares/auth.middleware.js');
const { Router } = express;
const router = new Router();

router.post("/register", checkAuth, registerUser)
router.post("/login", checkAuth, loginUser)
router.get("/logout", authUser, logoutUser);


module.exports = router;