const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const authRouter = require('./authRoutes');

router.use('/users',authRouter);


module.exports = router;