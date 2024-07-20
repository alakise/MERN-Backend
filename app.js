const express = require('express');
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");
const cors = require('cors');

//import post router and user router
const userRouter = require('./routes/user.router')


const app = express();


// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
//add middleware to parse request body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//Middleware for API endpoints
app.use("/", userRouter)

module.exports = app;