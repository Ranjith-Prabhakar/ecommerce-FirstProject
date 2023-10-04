const BrandModal = require('../model/brandModal')
const  {errorHandler} = require('../middleWare/errorMiddleWare')
const getBrandManagement = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const brands = await BrandModal.find()
            res.render('admin/catagoryManagement/catagoryManagement', { catagoryManagement: true, brands });
        } else {
            req.session.loginErrorMessage = 'Login First';
            res.redirect('/adminLogin');
        }
    }catch(err){
        errorHandler(err, req, res, next);
    }
}
const postCreateBrand = async (req, res) => {
    try {
        const validation = await BrandModal.findOne({ brandName: { $regex: new RegExp('^' + req.body.brandName + '$', 'i') } });
        if (!validation) {
            const newBrand = await BrandModal({
                brandName: req.body.brandName
            })
            await newBrand.save()
            res.json({brandCreation : 'Brand has created try new one'})
            
        } else {
            res.json({existingBrand : 'Brand already exist'})
        }
    } catch(err){
        errorHandler(err, req, res, next);
    }
}
module.exports = {
    getBrandManagement,
    postCreateBrand,
}