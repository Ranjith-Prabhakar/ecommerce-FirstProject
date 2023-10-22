const router = require('express').Router()
const userCartController = require('../controller/userCartController')
const { userSessionHandler, userValidation } = require('../middleWare/userValidator')

router.get('/cart',userSessionHandler, userValidation,userCartController.getCart)
router.post('/addToCart',userSessionHandler, userValidation,userCartController.postAddToCart)
router.post('/updateCartProductQty',userSessionHandler, userValidation,userCartController.postUpdateCartProductQty)
router.post('/removeFromCart',userSessionHandler, userValidation,userCartController.postRemoveFromCart)
module.exports = router