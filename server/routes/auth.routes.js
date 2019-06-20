const express = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.route('/auth/signIn')
  .post(authController.signIn);

authRouter.route('/auth/logout')
  .post(authController.logout);

module.exports = authRouter;
