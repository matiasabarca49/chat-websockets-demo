const express = require('express')
const { authUser } = require('../middlewares/auth.middleware.js')

const { Router } = express

const router = new Router()

router.get("/", authUser, (req,res) => {
    res.render("chat", {})
})

router.get("/login", (req,res) =>{
    res.render("login", {});
})

router.get("/register", (req,res) =>{
    res.render("register", {});
})

module.exports = router