const BrandModal = require('../model/brandModal')
const BannerModal = require('../model/bannarModal')
const  {errorHandler} = require('../middleWare/errorMiddleWare')


const getBannerManagement = (req, res,next) => {
    try {
        if (req.session.isAdmin) {
            res.render('./admin/bannerManagement/bannerManagement')
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/adminLogin')
        }
    } catch(err){
        errorHandler(err, req, res, next);
    }
}



const getCreateBanner = async (req, res,next) => {
    try {
        if (req.session.isAdmin) {
            const brand = await BrandModal.distinct('brandName')
            res.render('./admin/bannerManagement/bannerCreation', { brand })
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/adminLogin')
        }
    }catch(err){
        errorHandler(err, req, res, next);
    }
}

const postCreateBanner = async (req, res,next) => {
    try {
        const newBanner = await BannerModal({
            brandName: req.body.brandName,
            productName: req.body.productName,
            discription: req.body.discription,
            unitPrice: req.body.unitPrice,
            launchDate: req.body.launchDate,
            images: req.file.filename
        })
        await newBanner.save()
        res.redirect('/bannerManagement')

    } catch(err){
        errorHandler(err, req, res, next);
    }
}

module.exports ={
    getBannerManagement,
    getCreateBanner,
    postCreateBanner,  
}