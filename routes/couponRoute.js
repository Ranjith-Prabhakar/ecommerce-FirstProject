const router = require('express').Router()
const couponController = require('../controller/couponController')
const { adminValidation} = require('../middleWare/adminValidator')

router.get("/couponManagement",adminValidation, couponController.getCouponManagement)
router.post("/createCoupon",adminValidation,couponController.postCreateCoupon)
router.post('/couponCancell',adminValidation,couponController.postCouponCancell)


module.exports = router



