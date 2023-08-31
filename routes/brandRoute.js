const router = require('express').Router()
const brandController = require('../controller/brandController')
const { adminSessionHandler} = require('../middleWare/adminValidator')

router.get('/catagoryManagement', adminSessionHandler, brandController.getBrandManagement)/////
router.get('/createBrand',adminSessionHandler, brandController.getCreateBrand)/////
router.post('/createBrand', adminSessionHandler, brandController.postCreateBrand)


module.exports = router