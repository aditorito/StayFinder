const express = require('express');
const listingRouter = express.Router();
const authMiddleware = require('../middlewares/middleware')
const listingController = require('../controllers/listingControllers')

listingRouter.post('/', authMiddleware, listingController.listingProperty);
listingRouter.get('/',authMiddleware,listingController.getlistedProperty);

module.exports  = listingRouter;