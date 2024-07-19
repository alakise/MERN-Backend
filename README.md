# User Management API

## Overview

This project is a robust User Management API built with Node.js and Express. It provides a secure and flexible system for user authentication, authorization, and role-based access control. The API is documented using Swagger for easy exploration and testing.

## Features

- User authentication (signup and login)
- Role-based access control (User, Moderator, Admin)
- User profile management
- Admin functions (change user roles, delete users)
- Interactive API documentation with Swagger

## Technology Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- Jest and Supertest for testing
- Swagger for API documentation
- Yarn package manager

## Project Structure

```
project-root/
├── auth/
│   └── user.auth.js
├── config/
│   └── config.js
├── controller/
│   └── user.controller.js
├── db/
├── model/
│   └── User.model.js
├── node_modules/
├── routes/
│   └── user.router.js
├── test/
│   └── user.routes.test.js
├── .env
├── .gitignore
├── app.js
├── package.json
├── server.js
├── swagger.yaml
└── yarn.lock
```

## API Endpoints

- `POST /auth/signup`: Create a new user account
- `POST /auth/login`: Authenticate a user and receive a token
- `PATCH /user/update`: Update user profile (authenticated users)
- `DELETE /user/delete/:id`: Delete a user (Moderator and Admin only)
- `PATCH /user/change-role`: Change a user's role (Admin only)

For a complete list and details of all endpoints, please refer to the Swagger documentation.

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/user-management-api.git
   ```

2. Install dependencies:
   ```
   cd user-management-api
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   yarn start
   ```

## Running Tests

To run the test suite:

```
yarn test
```

## API Documentation

This project uses Swagger for API documentation. To view the interactive API documentation:

1. Start the server
2. Navigate to `http://localhost:3000/api-docs` in your web browser

The Swagger UI provides a detailed view of all API endpoints, allowing you to explore and test the API directly from your browser.

## Swagger Configuration

Swagger is configured in the main application file (`app.js` or `server.js`) as follows:

```javascript
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
        url: `http://localhost:${CONFIG.PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);
```

Make sure to update the Swagger documentation in your route files using JSDoc comments for accurate API representation.

## Authentication

This API uses JWT for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## Role-Based Access Control

The API supports three user roles:

- User: Basic access
- Moderator: Can perform user management tasks
- Admin: Full access to all features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.