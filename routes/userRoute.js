const router = require('express').Router()
const userController = require('../controller/userController')
const { validateUser,userSessionHandler } = require('../middleWare/userValidator')


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

router.post('/userLogOut', userController.postUserLogOut)
router.get('/brandsfilter', userController.getBrandFilter)



router.get('/singleProductPage', userController.getSingleProductPage)

module.exports = router