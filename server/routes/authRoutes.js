const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authControllers')

authRouter.post('/signup', authController.signup)

module.exports = authRouter;
