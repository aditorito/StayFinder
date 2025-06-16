const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const authRouter = require('./authRoutes');
const listingRouter = require('./listingRoutes');
const bookingRouter = require('./bookingRoutes');

router.use('/users',authRouter);
router.use('/listings',listingRouter);
router.use('/bookings',bookingRouter);


module.exports = router;