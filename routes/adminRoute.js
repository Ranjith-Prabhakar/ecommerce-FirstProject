const router = require('express').Router()
const adminController = require('../controller/adminController')

const validator = (req, res, next) => {
    if (req.session.isAdmin) {
        res.redirect('/digiWorld/admin/adminPanel')
    } else if (req.session.userId) {
        res.redirect('/digiWorld/user/userHome')
    }
    next()
}

//multer
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/productImages")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})
//===================================================




// router.get('/adminSignUp',adminController.getAdminSignUp)
// router.post('/adminSignUp',adminController.postAdminSignUp)
router.get('/adminLogin', validator, adminController.getAdminLogin)
router.post('/adminLogin', validator, adminController.postAdminLogin)
router.get('/adminOtpVerificationCode', validator, adminController.getAdminOtpVerificationCode)
router.post('/adminOtpVerificationCode', validator, adminController.postAdminOtpVerificationCode)
router.get('/adminPanel', adminController.getAdminPanel)
router.post('/adminLogout', adminController.postAdminLogout)
///user management
router.get('/userManagement', adminController.getUserManagement)
router.post('/userManagement/editRequest', adminController.postEditUserManagement)
router.post('/userManagement/editSubmit', adminController.postEditSubmit)
router.post('/userManagement/editConfirm', adminController.postEditConfirm)
router.post('/userManagement/deleteRequest', adminController.postDeleteUserManagement)
router.post('/userManagement/deleteConfirm', adminController.postDeleteConfirm)
///product management
router.get('/productManagement', adminController.getProductManagement)
router.get('/productManagement/createProduct', adminController.getCreateProductManagement)
router.post('/productManagement/createProduct',upload.array('gallery',3), adminController.postCreateProductManagement)
module.exports = router