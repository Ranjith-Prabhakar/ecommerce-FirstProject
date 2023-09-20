const router = require('express').Router()
const userController = require('../controller/userController')
const { userRestriction, userSessionHandler, userValidation } = require('../middleWare/userValidator')
const { profileImageUpload } = require('../middleWare/multer')


router.get('/', userSessionHandler, userController.userHome)
router.get('/home/:paramName', userSessionHandler, userController.userHome)
router.get('/search', userController.getSearch)
router.get('/userLogin', userSessionHandler, userRestriction, userController.getUserLogin)
router.post('/userLogin', userSessionHandler, userRestriction, userController.postUserLogin)
router.get('/userSignUp', userSessionHandler, userRestriction, userController.getUserSignUp)
router.post('/userSignUp', userSessionHandler, userRestriction, userController.postUserSignUp)
router.get('/userOtpVerificationCode', userSessionHandler, userRestriction, userController.getUserOtpVerificationCode)
router.post('/userOtpVerificationCode', userSessionHandler, userRestriction, userController.postUserOtpVerificationCode)

router.get('/brandPage', userSessionHandler, userController.getBrandPage)

router.post('/userLogOut', userSessionHandler, userSessionHandler, userValidation, userController.postUserLogOut)
router.get('/brandsfilter', userSessionHandler, userController.getBrandFilter)



router.get('/singleProductPage', userSessionHandler, userController.getSingleProductPage)

router.get('/profile', userSessionHandler, userValidation, userController.getProfile)
router.post('/addProfileImage', userSessionHandler, userValidation, profileImageUpload.single('profileImage'), userController.postaddProfileImage)
router.post('/createAddress', userSessionHandler, userValidation, userController.postCreateAddress)
router.post('/editAddress', userSessionHandler, userValidation, userController.postEditAddress)
router.post('/deleteAddress', userSessionHandler, userValidation, userController.postDeleteAddress)

//cart

router.get('/cart',userSessionHandler, userValidation,userController.getCart)
router.post('/addToCart',userSessionHandler, userValidation,userController.postAddToCart)
router.post('/updateCartProductQty',userSessionHandler, userValidation,userController.postUpdateCartProductQty)
router.post('/removeFromCart',userSessionHandler, userValidation,userController.postRemoveFromCart)

// checkOut
router.get('/checkOutPage',userSessionHandler,userValidation,userController.getCheckOutPage)
router.post('/buySelectedProducts',userSessionHandler,userValidation,userController.postBuySelectedProducts)
router.post('/orderPlacement',userSessionHandler,userValidation,userController.postOrderPlacement)


// order
router.get('/orders',userSessionHandler,userValidation,userController.getOrders)
router.get('/orderSinglePage',userSessionHandler,userValidation,userController.getOrderSinglePage)
router.post('/cancellOrder',userSessionHandler,userValidation,userController.postCancellOrder)
router.post('/orderReturnRequest',userSessionHandler,userValidation,userController.postOrderReturnRequest)

//wallet request for header
router.post('/wallet',userSessionHandler,userValidation,userController.postWallet)

//razor pay
router.post("/razorPayCreateOrder",userSessionHandler,userValidation,userController.postRazorPayCreateOrder)

module.exports = router