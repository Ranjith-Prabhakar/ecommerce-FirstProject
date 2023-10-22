const router = require('express').Router()
const userProfileController = require('../controller/userProfileController')
const { userSessionHandler, userValidation } = require('../middleWare/userValidator')
const { profileImageUpload } = require('../middleWare/multer')

router.get('/profile', userSessionHandler, userValidation, userProfileController.getProfile)
router.post('/addProfileImage', userSessionHandler, userValidation, profileImageUpload.single('profileImage'), userProfileController.postaddProfileImage)
router.post('/createAddress', userSessionHandler, userValidation, userProfileController.postCreateAddress)
router.post('/editAddress', userSessionHandler, userValidation, userProfileController.postEditAddress)
router.post('/deleteAddress', userSessionHandler, userValidation, userProfileController.postDeleteAddress)

module.exports = router