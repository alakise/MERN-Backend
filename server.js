//import app
const app = require('./app');

//import config module
const CONFIG = require('./config/config');

//import database connection function
const connectToDB = require('./db/mongodb');

//invoke connecToDB function
connectToDB();

app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on http://localhost:${CONFIG.PORT}`)
})