const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/user.router');
const authController = require('../auth/user.auth');
const userController = require('../controller/user.controller');

// Mock the controllers
jest.mock('../auth/user.auth');
jest.mock('../controller/user.controller');

const app = express();
app.use(express.json());
app.use(userRouter);

describe('User Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should call authController.signup', async () => {
      const mockUser = { firstname: 'John', lastname: 'Doe', email: 'john@example.com', password: 'password123' };
      authController.signup.mockImplementation((req, res) => res.status(201).json({ message: 'User created' }));

      const response = await request(app)
        .post('/auth/signup')
        .send(mockUser);

      expect(response.statusCode).toBe(201);
      expect(authController.signup).toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    it('should call authController.login', async () => {
      const mockCredentials = { email: 'john@example.com', password: 'password123' };
      authController.login.mockImplementation((req, res) => res.status(200).json({ token: 'mock-token' }));

      const response = await request(app)
        .post('/auth/login')
        .send(mockCredentials);

      expect(response.statusCode).toBe(200);
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('PATCH /user/update', () => {
    it('should call authController.authenticate and userController.updateUser', async () => {
      const mockUpdate = { firstname: 'Jane' };
      authController.authenticate.mockImplementation((req, res, next) => next());
      userController.updateUser.mockImplementation((req, res) => res.status(200).json({ message: 'User updated' }));

      const response = await request(app)
        .patch('/user/update')
        .send(mockUpdate)
        .set('Authorization', 'Bearer mock-token');

      expect(response.statusCode).toBe(200);
      expect(authController.authenticate).toHaveBeenCalled();
      expect(userController.updateUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /user/delete/:id', () => {
    it('should call authController.authenticate and userController.deleteUser for user self-deletion', async () => {
      const userId = 'user123';
      authController.authenticate.mockImplementation((req, res, next) => next());
      userController.deleteUser.mockImplementation((req, res) => res.status(200).json({ message: 'User deleted' }));

      const response = await request(app)
        .delete(`/user/delete/${userId}`)
        .set('Authorization', 'Bearer mock-token');

      expect(response.statusCode).toBe(200);
      expect(authController.authenticate).toHaveBeenCalled();
      expect(userController.deleteUser).toHaveBeenCalled();
    });

  });

  describe('PATCH /user/update', () => {
    it('should call authController.authenticate and userController.updateUser', async () => {
      const mockUpdate = { firstname: 'Jane' };
      authController.authenticate.mockImplementation((req, res, next) => next());
      userController.updateUser.mockImplementation((req, res) => res.status(200).json({ message: 'User updated' }));

      const response = await request(app)
        .patch('/user/update')
        .send(mockUpdate)
        .set('Authorization', 'Bearer mock-token');

      expect(response.statusCode).toBe(200);
      expect(authController.authenticate).toHaveBeenCalled();
      expect(userController.updateUser).toHaveBeenCalled();
    });
  });
});