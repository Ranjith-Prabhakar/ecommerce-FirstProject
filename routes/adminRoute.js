const router = require('express').Router()
const adminController = require('../controller/adminController')
const { validateAdmin,adminSessionHandler} = require('../middleWare/adminValidator')


// router.get('/adminSignUp',adminController.getAdminSignUp)
// router.post('/adminSignUp',adminController.postAdminSignUp)
router.get('/adminLogin', validateAdmin, adminController.getAdminLogin)
router.post('/adminLogin', validateAdmin, adminController.postAdminLogin)
router.get('/adminOtpVerificationCode', validateAdmin, adminController.getAdminOtpVerificationCode)
router.post('/adminOtpVerificationCode', validateAdmin, adminController.postAdminOtpVerificationCode)
router.get('/adminPanel', adminSessionHandler, adminController.getAdminPanel)///
router.post('/adminLogout', adminSessionHandler,adminController.postAdminLogout)




module.exports = router



