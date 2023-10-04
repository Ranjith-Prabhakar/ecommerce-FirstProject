const router = require('express').Router()
const {upload,bannerImageUpload } = require('../middleWare/multer') //
const bannerController = require('../controller/bannerController')
const { adminValidation} = require('../middleWare/adminValidator')
router.get('/bannerManagement',adminValidation,  bannerController.getBannerManagement)
router.post('/createBanner',adminValidation,  bannerImageUpload.single('gallery'), bannerController.postCreateBanner)
module.exports = router