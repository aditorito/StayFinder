const express = require('express');
const listingRouter = express.Router();
const authMiddleware = require('../middlewares/middleware')
const listingController = require('../controllers/listingControllers')

listingRouter.get('/', authMiddleware, listingController.getlisting)

module.exports  = listingRouter;