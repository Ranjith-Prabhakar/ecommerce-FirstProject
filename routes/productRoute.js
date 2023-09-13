const router = require('express').Router()
const productController = require('../controller/productController')
const { upload } = require('../middleWare/multer')
const { adminValidation} = require('../middleWare/adminValidator')

router.get('/productManagement', adminValidation, productController.getProductManagement)
router.get('/createProduct', adminValidation, productController.getCreateProductManagement)
router.post('/createProduct', adminValidation, upload.array('gallery', 3), productController.postCreateProductManagement)
// router.post('/productEditRequest',adminValidation,  productController.postProductEditRequest)
router.post('/productEditConfirm',adminValidation,  productController.postProductEditConfirm)
router.post('/productAddOrRemove',adminValidation,  productController.postUpdateStock)
router.post('/productSoftDelete',adminValidation,  productController.postSoftDelete)


module.exports = router