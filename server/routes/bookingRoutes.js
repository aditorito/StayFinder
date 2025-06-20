const express = require('express');
const bookingRouter = express.Router();
const authMiddleware = require('../middlewares/middleware');
const bookingController = require('../controllers/bookingControllers');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

bookingRouter.post('/', authMiddleware, bookingController.booking);
bookingRouter.post('/upload', authMiddleware, upload.single('image'), bookingController.upload);

module.exports = bookingRouter;