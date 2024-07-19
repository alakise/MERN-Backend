//import dotenv
require('dotenv').config();

//add app config data
module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT
}