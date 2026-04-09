const express = require('express')
const { authUser, checkAuth } = require('../middlewares/auth.middleware.js')

const { Router } = express

const router = new Router()

router.get("/", authUser, (req,res) => {
    res.render("chat", {})
})

router.get("/login", checkAuth, (req,res) =>{
    res.render("login", {});
})

router.get("/register", checkAuth, (req,res) =>{
    res.render("register", {});
})

module.exports = router