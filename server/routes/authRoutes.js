const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middlewares/middleware');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/profile', authMiddleware,authController.getUserdetails);

module.exports = authRouter;
