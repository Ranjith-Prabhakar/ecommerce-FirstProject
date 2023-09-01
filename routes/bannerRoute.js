const router = require('express').Router()
const {upload } = require('../middleWare/multer')
const bannerController = require('../controller/bannerController')
const { adminValidation} = require('../middleWare/adminValidator')


router.get('/bannerManagement',adminValidation,  bannerController.getBannerManagement)
router.get('/createBanner',adminValidation,  bannerController.getCreateBanner)
router.post('/createBanner',adminValidation,  upload.array('gallery', 3), bannerController.postCreateBanner)


module.exports = router