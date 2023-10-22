const router = require('express').Router()
const userCheckOutController = require('../controller/userCheckOutController')
const { userSessionHandler, userValidation } = require('../middleWare/userValidator')
const couponExpiry = require('../middleWare/couponExpiry')
// checkOut
router.get('/checkOutPage',userSessionHandler,userValidation,couponExpiry,userCheckOutController.getCheckOutPage)
router.post('/buySelectedProducts',userSessionHandler,userValidation,userCheckOutController.postBuySelectedProducts)
router.post('/orderPlacement',userSessionHandler,userValidation,userCheckOutController.postOrderPlacement)

module.exports = router