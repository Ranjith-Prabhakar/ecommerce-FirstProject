const router = require('express').Router()
const userOrderController = require('../controller/userOrderController')
const {userSessionHandler, userValidation } = require('../middleWare/userValidator')

// order
router.get('/orders',userSessionHandler,userValidation,userOrderController.getOrders)
router.get('/orderSinglePage',userSessionHandler,userValidation,userOrderController.getOrderSinglePage)
router.post('/cancellOrder',userSessionHandler,userValidation,userOrderController.postCancellOrder)
router.post('/orderReturnRequest',userSessionHandler,userValidation,userOrderController.postOrderReturnRequest)

module.exports = router