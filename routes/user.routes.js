
//import express
const express = require('express');

//import authetication middleware
const authController = require('./../auth/user.auth')

//create router
const router = express.Router();

//API endpoint for signup and login
router.post("/auth/signup", authController.signup)
router.post("/auth/login", authController.login)

module.exports = router;