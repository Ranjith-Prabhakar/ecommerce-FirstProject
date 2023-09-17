const router = require('express').Router()
const productController = require('../controller/productController')
const { upload,productImageUpdate } = require('../middleWare/multer')
const { adminValidation} = require('../middleWare/adminValidator')

router.get('/productManagement', adminValidation, productController.getProductManagement)
router.post('/createProduct', adminValidation, upload.array('gallery', 3), productController.postCreateProductManagement)
// router.post('/productEditRequest',adminValidation,  productController.postProductEditRequest)
router.post('/productEditConfirm',adminValidation,  productController.postProductEditConfirm)
router.post('/productAddOrRemove',adminValidation,  productController.postUpdateStock)
router.post('/productSoftDelete',adminValidation,  productController.postSoftDelete)

router.post('/productImageUpdation',adminValidation,productImageUpdate.single('imageChange'), productController.postProductImageUpdation)
router.post('/deleteImage',adminValidation,productController.postDeleteImage)

module.exports = router