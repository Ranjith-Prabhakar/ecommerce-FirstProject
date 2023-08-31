const router = require('express').Router()
const userManagementController = require('../controller/userManagementController')
const { upload } = require('../middleWare/userValidator')
const { adminSessionHandler} = require('../middleWare/adminValidator')

router.get('/userManagement',adminSessionHandler, userManagementController.getUserManagement)
router.post('/userEditRequest',adminSessionHandler, userManagementController.postEditUserManagement)
router.post('/userEditSubmit',adminSessionHandler, userManagementController.postEditSubmit)
router.post('/userEditConfirm',adminSessionHandler, userManagementController.postEditConfirm)
router.post('/userDeleteRequest',adminSessionHandler, userManagementController.postDeleteUserManagement)
router.post('/userDeleteConfirm',adminSessionHandler, userManagementController.postDeleteConfirm)

module.exports = router