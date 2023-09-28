const router = require('express').Router()
const returnController  = require('../controller/returnController')
const { adminValidation} = require('../middleWare/adminValidator')

router.get('/returnManagement',adminValidation,returnController.getReturnmanagement)
router.post('/returnRazorPay',adminValidation,returnController. postReturnRazorPay)
router.post('/confirmReturn',adminValidation,returnController.postConfirmReturn)

module.exports = router