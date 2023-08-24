const router = require('express').Router()
const userController = require('../controller/userController')

const validator = (req,res,next)=>{
    if (req.session.isAdmin) {
        res.redirect('/digiWorld/admin/adminPanel')
    } else if (req.session.userId) {
        res.redirect('/digiWorld/user/userHome')
    }
    next()
}
router.get('/userHome',userController.userHome)
router.get('/userSignUp',validator,userController.getUserSignUp)
router.post('/userSignUp',validator,userController.postUserSignUp)
router.get('/userOtpVerificationCode',validator,userController.getUserOtpVerificationCode)
router.post('/userOtpVerificationCode',validator,userController.postUserOtpVerificationCode)
router.get('/userLogin',validator,userController.getUserLogin)
router.post('/userLogin',validator,userController.postUserLogin)
router.post('/userLogOut',userController.postUserLogOut)

module.exports = router