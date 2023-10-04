const router = require('express').Router()
const orderController = require('../controller/orderController')
const { adminValidation} = require('../middleWare/adminValidator')
router.get('/orderManagement',adminValidation, orderController.getOrderManagement)
router.post('/orderStatusEdit',adminValidation, orderController.postOrderStatusEdit)
router.get('/orderDetailPage',adminValidation, orderController.getOrderDetailPage)
module.exports = router