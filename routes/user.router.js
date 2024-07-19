
//import express
const express = require('express');

//import authetication middleware
const authController = require('../auth/user.auth')
const userController = require('../controller/user.controller')

//create router
const router = express.Router();

  
 // API endpoint for signup and login
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);

// Update user info (user itself)
router.patch(
  '/user/update', authController.authenticate, userController.updateUser);

// Delete user (by itself)
router.delete(
  '/user/delete/:id',
  authController.authenticate,
  userController.deleteUser
);

// Delete user (by admin)
router.delete(
  '/user/delete/:id',
  authController.authenticate,
  authController.adminLevel,
  userController.deleteUser,
);

// Change user role (by admin or moderator)
router.patch(
  '/user/change-role',
  authController.authenticate, 
  authController.moderatorLevel,
  userController.changeUserRole,
);

module.exports = router;