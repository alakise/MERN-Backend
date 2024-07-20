//import app
const app = require('./app');

//import config module
require('dotenv').config();

//import database connection function
const connectToDB = require('./db/mongodb');

//invoke connecToDB function
connectToDB();

//Swagger documentation
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Fundamental Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple REST API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Alakise",
                url: "https://github.com/alakise",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true }),
    
  );
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})