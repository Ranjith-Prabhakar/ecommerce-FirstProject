const router = require('express').Router()
const brandController = require('../controller/brandController')
const { adminValidation} = require('../middleWare/adminValidator')
router.get('/catagoryManagement', adminValidation, brandController.getBrandManagement)/////
router.post('/createBrand', adminValidation, brandController.postCreateBrand)
module.exports = router