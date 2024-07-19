const express = require('express');

//crete express app
const app = express();

//add middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

module.exports = app;