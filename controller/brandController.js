const BrandModal = require('../model/brandModal')
const  {errorHandler} = require('../middleWare/errorMiddleWare')


const getBrandManagement = async (req, res) => {
    try {
        if (req.session.isAdmin) {
           
            const brands = await BrandModal.find()
            res.render('./admin/catagoryManagement/catagoryManagement', { catagoryManagement: true, brands });
        } else {
            req.session.loginErrorMessage = 'Login First';
            res.redirect('/adminLogin');
        }
    }catch(err){
        errorHandler(err, req, res, next);
    }
}




// const getCreateBrand = (req, res) => {
//     try {
//         if (req.session.isAdmin) {
//             if (req.session.brandCreation) {
//                 res.render('./admin/catagoryManagement/brandCreation', { brandCreation: req.session.brandCreation })
//                 req.session.brandCreation = ''
//             } else {
//                 res.render('./admin/catagoryManagement/brandCreation')
//             }

//         } else {
//             req.session.loginErrorMessage = 'Login First'
//             res.redirect('/adminLogin')
//         }
//     } catch(err){
//         errorHandler(err, req, res, next);
//     }
// }

// const postCreateBrand = async (req, res) => {
//     try {
//         const validation = await BrandModal.findOne({ brandName: { $regex: new RegExp('^' + req.body.brandName + '$', 'i') } });

//         if (!validation) {
//             const newBrand = await BrandModal({
//                 brandName: req.body.brandName
//             })
//             await newBrand.save()
//             req.session.brandCreation = 'Brand has created try new one'
//             res.redirect('/createBrand')
//         } else {
//             req.session.brandCreation = 'Brand already exist'
//             res.redirect('/createBrand')
//         }


//     } catch(err){
//         errorHandler(err, req, res, next);
//     }
// }

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