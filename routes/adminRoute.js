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

const validateUserId = (req, res, next) => {
   if (req.session.userId) {
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
router.get('/adminPanel',validateUserId, adminController.getAdminPanel)///
router.post('/adminLogout', adminController.postAdminLogout)
///user management
router.get('/userManagement',validateUserId, adminController.getUserManagement)
router.post('/userManagement/editRequest', validateUserId,adminController.postEditUserManagement)
router.post('/userManagement/editSubmit', validateUserId,adminController.postEditSubmit)
router.post('/userManagement/editConfirm', validateUserId,adminController.postEditConfirm)
router.post('/userManagement/deleteRequest',validateUserId, adminController.postDeleteUserManagement)
router.post('/userManagement/deleteConfirm',validateUserId, adminController.postDeleteConfirm)
///product management
router.get('/productManagement',validateUserId, adminController.getProductManagement)
router.get('/productManagement/createProduct',validateUserId, adminController.getCreateProductManagement)
router.post('/productManagement/createProduct',validateUserId,upload.array('gallery',3), adminController.postCreateProductManagement)
//catagory management
router.get('/catagoryManagement',validateUserId,adminController.getBrandManagement)/////
router.get('/catagoryManagement/createBrand',validateUserId,adminController.getCreateBrand)/////
router.post('/catagoryManagement/createBrand',validateUserId,adminController.postCreateBrand)

//bannerManagement
router.get('/bannerManagement',validateUserId,adminController.getBannerManagement)
router.get('/bannerManagement/createBanner',validateUserId,adminController.getCreateBanner)
router.post('/bannerManagement/createBanner',validateUserId,upload.single('gallery'),adminController.postCreateBanner)
module.exports = router



// router.get('/adminSignUp',adminController.getAdminSignUp)////
// router.post('/adminSignUp',adminController.postAdminSignUp)///

// router.get('/adminLogin', validator, adminController.getAdminLogin)
// router.post('/adminLogin', validator, adminController.postAdminLogin)
// router.get('/adminOtpVerificationCode', validator, adminController.getAdminOtpVerificationCode)
// router.post('/adminOtpVerificationCode', validator, adminController.postAdminOtpVerificationCode)
// router.get('/adminPanel', adminController.getAdminPanel)
// router.post('/adminLogout', adminController.postAdminLogout)
///user management
// router.get('/userManagement', validator,adminController.getUserManagement)
// router.post('/userManagement/editRequest', validator,adminController.postEditUserManagement)
// router.post('/userManagement/editSubmit', validator,adminController.postEditSubmit)
// router.post('/userManagement/editConfirm', validator,adminController.postEditConfirm)
// router.post('/userManagement/deleteRequest',validator, adminController.postDeleteUserManagement)
// router.post('/userManagement/deleteConfirm',validator, adminController.postDeleteConfirm)
///product management
// router.get('/productManagement',validator, adminController.getProductManagement)
// router.get('/productManagement/createProduct',validator, adminController.getCreateProductManagement)
// router.post('/productManagement/createProduct',validator,upload.array('gallery',3), adminController.postCreateProductManagement)
//catagory management
// router.get('/catagoryManagement',validator,adminController.getBrandManagement)/////
// router.get('/catagoryManagement/createBrand',validator,adminController.getCreateBrand)/////
// router.post('/catagoryManagement/createBrand',validator,adminController.postCreateBrand)
// module.exports = router