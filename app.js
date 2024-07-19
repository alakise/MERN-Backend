const express = require('express');
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

//import post router and user router
const userRouter = require('./routes/user.router')

const app = express();

//add middleware to parse request body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//Middleware for API endpoints
app.use("/api", userRouter)

module.exports = app;