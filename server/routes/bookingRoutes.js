const express = require('express');
const bookingRouter = express.Router();
const authMiddleware = require('../middlewares/middleware');
const bookingController = require('../controllers/bookingControllers');

bookingRouter.post('/', authMiddleware, bookingController.booking);

module.exports = bookingRouter;