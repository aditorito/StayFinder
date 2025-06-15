const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const authRouter = require('./authRoutes');
const listingRouter = require('./listingRoutes');

router.use('/users',authRouter);
router.use('/listings',listingRouter);


module.exports = router;