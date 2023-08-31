const router = require('express').Router()
const productController = require('../controller/productController')
const { upload } = require('../middleWare/multer')
const { adminSessionHandler} = require('../middleWare/adminValidator')

router.get('/productManagement', adminSessionHandler, productController.getProductManagement)
router.get('/createProduct', adminSessionHandler, productController.getCreateProductManagement)
router.post('/createProduct', adminSessionHandler, upload.array('gallery', 3), productController.postCreateProductManagement)
router.post('/productEditRequest',adminSessionHandler,  productController.postProductEditRequest)
router.post('/productEditConfirm',adminSessionHandler,  productController.postProductEditConfirm)
router.post('/productAddOrRemove',adminSessionHandler,  productController.postUpdateStock)
router.post('/productSoftDelete',adminSessionHandler,  productController.postSoftDelete)


module.exports = router