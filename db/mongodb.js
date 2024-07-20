//import mongoose 
const mongoose = require('mongoose');
require('dotenv').config();

//database connection function
function connectToDB(){
    mongoose.connect(process.env.MONGODB_URL);

    //Add event listener to test connection
    mongoose.connection.on('connected', () => {
        console.log('connection to DB successful')
    })
    //catch error
    mongoose.connection.on("error", (err) => {
        console.log('Connection to DB failed')
        console.log(err)
    })
}
//export database connection function
module.exports = connectToDB;