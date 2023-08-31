const router = require('express').Router()
const {upload } = require('../middleWare/multer')
const bannerController = require('../controller/bannerController')
const { adminSessionHandler} = require('../middleWare/adminValidator')


router.get('/bannerManagement',adminSessionHandler,  bannerController.getBannerManagement)
router.get('/createBanner',adminSessionHandler,  bannerController.getCreateBanner)
router.post('/createBanner',adminSessionHandler,  upload.array('gallery', 3), bannerController.postCreateBanner)


module.exports = router