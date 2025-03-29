const router = require('express').Router()
const adminController = require('../controller/adminController')
const { adminRestriction,adminSessionHandler,adminValidation} = require('../middleWare/adminValidator')
router.get('/adminSignUp',adminSessionHandler,adminRestriction,adminController.getAdminSignUp)
router.post('/adminSignUp',adminSessionHandler,adminRestriction,adminController.postAdminSignUp)
router.get('/adminLogin',adminSessionHandler, adminRestriction, adminController.getAdminLogin)
router.post('/adminLogin',adminSessionHandler,  adminRestriction, adminController.postAdminLogin)
router.get('/adminPanel',adminValidation, adminSessionHandler,  adminController.getAdminPanel)
router.post('/adminLogout',adminValidation, adminSessionHandler,adminController.postAdminLogout)
router.get('/salesReport',adminValidation,adminSessionHandler,adminController.getSalesReport)
module.exports = router



