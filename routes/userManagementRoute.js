const router = require('express').Router()
const userManagementController = require('../controller/userManagementController')
const { adminValidation} = require('../middleWare/adminValidator')

router.get('/userManagement',adminValidation, userManagementController.getUserManagement)
router.post('/userEditRequest',adminValidation, userManagementController.postEditUserManagement)
router.post('/userEditSubmit',adminValidation, userManagementController.postEditSubmit)
router.post('/userEditConfirm',adminValidation, userManagementController.postEditConfirm)
router.post('/userDeleteRequest',adminValidation, userManagementController.postDeleteUserManagement)
router.post('/userDeleteConfirm',adminValidation, userManagementController.postDeleteConfirm)

module.exports = router