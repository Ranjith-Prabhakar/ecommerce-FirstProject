const router = require('express').Router()
const userController = require('../controller/userController')
const { validateUser,userSessionHandler } = require('../middleWare/userValidator')
const { profileImageUpload } = require('../middleWare/multer')


router.get('/', userController.userHome)
router.get('/Home', userController.userHome)
router.get('/search', userController.getSearch)
router.get('/userLogin', validateUser, userController.getUserLogin)
router.post('/userLogin', validateUser, userController.postUserLogin)
router.get('/userSignUp', validateUser, userController.getUserSignUp)
router.post('/userSignUp', validateUser, userController.postUserSignUp)
router.get('/userOtpVerificationCode', validateUser, userController.getUserOtpVerificationCode)
router.post('/userOtpVerificationCode', validateUser, userController.postUserOtpVerificationCode)

router.get('/brandPage', userController.getBrandPage)

router.post('/userLogOut',userSessionHandler, userController.postUserLogOut)
router.get('/brandsfilter', userController.getBrandFilter)



router.get('/singleProductPage', userController.getSingleProductPage)

router.get('/profile',userSessionHandler,userController.getProfile)
router.post('/addProfileImage',profileImageUpload.single('profileImage'),userSessionHandler,userController.postaddProfileImage)
router.post('/createAddress',userSessionHandler,userController.postCreateAddress)
router.post('/editAddress',userSessionHandler,userController.postEditAddress)
router.post('/deleteAddress',userSessionHandler,userController.postDeleteAddress)

module.exports = router