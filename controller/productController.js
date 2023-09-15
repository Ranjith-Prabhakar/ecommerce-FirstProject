const ProductModal = require('../model/productModal')
const BrandModal = require('../model/brandModal')
const { errorHandler } = require('../middleWare/errorMiddleWare')
const fs = require('fs')
const path = require('path')

const getProductManagement = async (req, res) => {
    try {
        const products = await ProductModal.find().sort({ unitPrice: 1 })
        res.render('./admin/productManagement/productManagement', { products, productManagement: true })

    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getCreateProductManagement = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            if (req.session.existingProduct) {
                const brand = await BrandModal.distinct('brandName')
                res.render('./admin/productManagement/createProduct', { brand, existingProduct: req.session.existingProduct })
            } else {
                const brand = await BrandModal.distinct('brandName')
                res.render('./admin/productManagement/createProduct', { brand })
            }

        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postCreateProductManagement = async (req, res) => {
    try {
        let arrImages = []
        for (let i = 0; i < req.files.length; i++) {
            arrImages[i] = req.files[i].filename
        }
        let validation = await ProductModal.findOne({ brandName: req.body.brandName, productName: req.body.productName })
        if (!validation) {
            await BrandModal.updateOne({ brandName: { $eq: req.body.brandName } }, { $inc: { noOfModels: 1 } })
            const newProduct = await ProductModal({
                brandName: req.body.brandName,
                productName: req.body.productName,
                quantity: req.body.quantity,
                unitPrice: req.body.unitPrice,
                gallery: arrImages,
                discription: req.body.discription,
                specification: {
                    frontCamera: req.body.frontCamera,
                    backCamera: req.body.backCamera,
                    ram: req.body.ram,
                    internalStorage: req.body.internalStorage,
                    battery: req.body.battery,
                    processor: req.body.processor,
                    chargerType: req.body.chargerType,
                }
            })
            await newProduct.save()
            res.redirect('/productManagement')
        } else {
            req.session.existingProduct = "Product already exist"
            res.redirect('/createProduct')
        }


    } catch (err) {
        errorHandler(err, req, res, next);
    }
}


const postProductEditConfirm = async (req, res) => {
    try {
        const finalformObj = req.body.finalformObj
        await ProductModal.updateOne({ _id: finalformObj.id }, {
            brandName: finalformObj.brandName,
            productName: finalformObj.productName,
            quantity: finalformObj.quantity,
            unitPrice: finalformObj.unitPrice,
            specification: {
                frontCamera: finalformObj.frontCamera,
                backCamera: finalformObj.backCamera,
                ram: finalformObj.ram,
                internalStorage: finalformObj.internalStorage,
                battery: finalformObj.battery,
                processor: finalformObj.processor,
                chargerType: finalformObj.chargerType,
            }
        });
        res.json({ success: true })

        // await ProductModal.updateOne({ _id: req.body.id }, {
        //     brandName: req.body.brandName,
        //     productName: req.body.productName,
        //     quantity: req.body.quantity,
        //     unitPrice: req.body.unitPrice,
        //     specification: {
        //         frontCamera: req.body.frontCamera,
        //         backCamera: req.body.backCamera,
        //         ram: req.body.ram,
        //         internalStorage: req.body.internalStorage,
        //         battery: req.body.battery,
        //         processor: req.body.processor,
        //         chargerType: req.body.chargerType,
        //     }
        // });
        // res.redirect('/productManagement')
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postUpdateStock = async (req, res) => {
    try {
        const productId = req.body.productId;
        const newQuantity = req.body.quantity;
        const updatedQuantity = await ProductModal.updateOne({ _id: productId }, { $set: { quantity: newQuantity } })
        res.json({ success: true, updatedQuantity });
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const postSoftDelete = async (req, res) => {
    try {
        if (req.body.freezValue === "active") {
            req.body.freezValue = "freez"
        } else {
            req.body.freezValue = 'active'
        }

        const productFreez = await ProductModal.updateOne({ _id: req.body.productId }, { $set: { freez: req.body.freezValue } })
        if (productFreez.acknowledged) {
            res.json({ success: true, newFreezValue: req.body.freezValue })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postProductImageUpdation = async (req, res, next) => {
    try {
        res.redirect('/productManagement')
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}
const postDeleteImage = async (req, res, next) => {
    try {
        console.log("inside postDeleteImage");
        console.log(req.body.productData);
        let {productId,imageName}=req.body.productData
        const filePath = path.join(__dirname, '..', 'public', 'productImages', imageName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Image deleted');
            await ProductModal.updateOne({_id:productId},{$pull:{gallery:imageName}})
            res.json({ success: true })

        } else {
            console.log('Image not found');
            res.status(404).json({ success: false, message: 'Image not found' });
          }
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}

module.exports = {
    getProductManagement,
    getCreateProductManagement,
    postCreateProductManagement,
    postProductEditConfirm,
    postUpdateStock,
    postSoftDelete,
    postProductImageUpdation,
    postDeleteImage
}