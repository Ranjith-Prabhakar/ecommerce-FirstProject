const BrandModal = require('../model/brandModal')
const BannerModal = require('../model/bannarModal')
const  {errorHandler} = require('../middleWare/errorMiddleWare')
const getBannerManagement = async(req, res,next) => {
    try {
        if (req.session.isAdmin) {
            let banner = await BannerModal.find().limit(3) 
            let brand = await BrandModal.distinct('brandName')
            res.render('admin/bannerManagement/bannerManagement',{banner,brand})
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/adminLogin')
        }
    } catch(err){
        errorHandler(err, req, res, next);
    }
}
const postCreateBanner = async (req, res, next) => {
    try {
        const bannerId = req.body.bannerId;
        // Check if a document with the given bannerId exists
        if (bannerId !== 'default') {
            const existingBanner = await BannerModal.findOne({ _id: bannerId });
            if (existingBanner) {
                // If a document with the same bannerId exists, update it
                existingBanner.brandName = req.body.brandName;
                existingBanner.productName = req.body.productName;
                existingBanner.description = req.body.description;
                existingBanner.unitPrice = req.body.unitPrice;
                existingBanner.launchDate = req.body.launchDate;
                existingBanner.images = req.file.filename;
                await existingBanner.save();
            } else {
                // Handle the case where the specified bannerId doesn't exist
                // You can return an error or handle it as needed
                // For example, you can redirect to an error page
                res.redirect('/error'); // Adjust this to your error route
            }
        } else {
            // If bannerId is 'default', create a new banner
            const newBanner = new BannerModal({
                brandName: req.body.brandName,
                productName: req.body.productName,
                description: req.body.description,
                unitPrice: req.body.unitPrice,
                launchDate: req.body.launchDate,
                images: req.file.filename
            });
            await newBanner.save();
        }
        res.redirect('/bannerManagement');
    } catch (err) {
        errorHandler(err, req, res, next);
    }
};
module.exports ={
    getBannerManagement,
    postCreateBanner,  
}