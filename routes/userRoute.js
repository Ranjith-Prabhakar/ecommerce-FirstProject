const router = require('express').Router()
const userController = require('../controller/userController')
const { userRestriction, userSessionHandler, userValidation } = require('../middleWare/userValidator')

router.get('/', userSessionHandler, userController.userHome)
router.get('/home/:paramName', userSessionHandler, userController.userHome)
router.get('/userHomeSort',userSessionHandler, userController.getUserHomeSort)/////////////////////////////////////////////////////////////////
router.get('/search', userController.getSearch)
router.get('/brandSort',userController.getBrandSort)
router.get('/filterBrandSort',userController.getFilterBrandSort)
router.get('/userLogin', userSessionHandler, userRestriction, userController.getUserLogin)
router.post('/userLogin', userSessionHandler, userRestriction, userController.postUserLogin)
router.get('/userSignUp', userSessionHandler, userRestriction, userController.getUserSignUp)
router.post('/userSignUp', userSessionHandler, userRestriction, userController.postUserSignUp)
router.get('/userOtpVerificationCode', userSessionHandler, userRestriction, userController.getUserOtpVerificationCode)
router.get('/resendOtp',userSessionHandler,userRestriction,userController.getResendOtp)
router.post('/userOtpVerificationCode', userSessionHandler, userRestriction, userController.postUserOtpVerificationCode)
router.get('/brandPage', userSessionHandler, userController.getBrandPage)
router.post('/userLogOut', userSessionHandler, userSessionHandler, userValidation, userController.postUserLogOut)
router.get('/brandsfilter', userSessionHandler, userController.getBrandFilter)
router.get('/singleProductPage', userSessionHandler, userController.getSingleProductPage)
//wallet request for header
router.post('/wallet',userSessionHandler,userValidation,userController.postWallet)
//razor pay
router.post("/razorPayCreateOrder",userSessionHandler,userValidation,userController.postRazorPayCreateOrder)
//add money to wallet
router.post('/addWalletMoney',userSessionHandler,userValidation,userController.postAddWalletMoney)
//email checking for signup
router.post('/checkMail',userController.postMailCheck)
//product  rating and review
router.post('/rateProduct',userSessionHandler,userValidation,userController.postRateProduct)
router.post('/reviewProduct',userSessionHandler,userValidation,userController.postReviewProduct)

module.exports = router