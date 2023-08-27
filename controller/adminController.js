const AdminModal = require('../model/adminModal')
const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const BannerModal = require('../model/bannarModal')
require('dotenv').config()
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const productModal = require('../model/productModal')

////////////////

// const getAdminSignUp  = (req,res)=>{
//     res.render('./admin/adminSignUp')
// }

// const postAdminSignUp =async(req,res)=>{
//     console.log("postAdminSignUp  level1",);
//     let hash = await bcrypt.hash(req.body.password, 4)
//     const admin = await AdminModal({
//         firstName:req.body.firstName,
//         lastName:req.body.lastName,
//         email:req.body.email,
//         phone:req.body.phone,
//         userName:req.body.userName,
//         password:hash,
//     })
//     const Admin = await admin.save()
//     console.log("postAdminSignUp  level2",Admin);
//     res.end()
// }

const getAdminLogin = (req, res) => {
    if (req.session.unAutherisedAdmin) {
        res.render('./admin/adminLogin', { unAutherisedAdmin: req.session.unAutherisedAdmin, login: true })////
        req.session.unAutherisedAdmin = ""
    } else if (req.session.loginErrorMessage) {
        res.render('./admin/adminLogin', { loginErrorMessage: req.session.loginErrorMessage, login: true })////
        req.session.loginErrorMessage = ""
    }
    else {
        res.render('./admin/adminLogin', { login: true })////
    }
}

const postAdminLogin = async (req, res) => {
    try {
        const adminData = await AdminModal.findOne({ userName: req.body.userName, isAdmin: true })
        if (adminData) {
            bcrypt.compare(req.body.password, adminData.password, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                } else {
                    if (result) {

                        // Create a Nodemailer transporter
                        let transporter = nodeMailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: process.env.nodeMailerEmail,
                                pass: process.env.nodeMailerEmailPassword
                            }
                        })

                        // Generate a random OTP
                        const otp = randomString.generate({
                            length: 6,
                            charset: 'numeric',
                        });
                        // Define the email content
                        const mailOptions = {
                            from: process.env.nodeMailerEmail, // Sender email
                            to: adminData.email, // Recipient email
                            subject: 'OTP Verification Code',
                            text: `Your OTP is: ${otp}`,
                        };
                        // Send the email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Error sending email:', error);
                            } else {
                                req.session.otp = otp
                                res.redirect('/digiworld/admin/adminOtpVerificationCode')
                            }
                        });
                    } else {
                        req.session.unAutherisedAdmin = 'You are  unautherised to login'
                        res.redirect('/digiWorld/admin/adminLogin')
                    }
                }
            });
        } else {
            req.session.loginErrorMessage = 'invalid username or password'
            res.redirect('/digiWorld/admin/adminLogin')
        }


    } catch (error) {
        console.log(error.message);
    }
}



const getAdminOtpVerificationCode = async (req, res) => {
    if (req.session.otpErrorMessage) {
        res.render('./admin/adminOtpVerificationCode', { otpErrorMessage: req.session.otpErrorMessage, otp: true })/////
    } else {
        res.render('./admin/adminOtpVerificationCode', { otp: true })/////
    }

}



const postAdminOtpVerificationCode = async (req, res) => {
    if (req.body.otp === req.session.otp) {
        req.session.otp = ''
        req.session.isAdmin = true
        res.cookie('password', 'helloWorld')
        res.redirect('/digiWorld/admin/adminPanel')
    } else {
        req.session.otpErrorMessage = 'invalid otp'
        res.redirect('/digiworld/admin/adminOtpVerificationCode')
    }
}

const getAdminPanel = (req, res) => {

    if (req.session.isAdmin) {
        res.render('./admin/adminPanel', { adminPanel: true })
    } else {
        req.body.unAutherisedAdmin = 'login first'
        res.redirect('/digiWorld/admin/adminLogin')
    }
}

const postAdminLogout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
            } else {
                res.clearCookie('password')
                res.redirect('/digiWorld/admin/adminLogin')
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

// UserManagement =======================================================================================================

const getUserManagement = async (req, res) => {
    const users = await UserModal.find()
    res.render('./admin/userManagement/userManagement', { users, userManagement: true })
}

const postEditUserManagement = async (req, res) => {
    req.session.confirmEditUserManagement_id = req.body.id
    res.render('./admin/userManagement/editUserManagement')
}

const postEditSubmit = async (req, res) => {
    req.session.confirmEditUserManagement_status = req.body.status
    res.render('./admin/userManagement/confirmEditUserManagement')
}

const postEditConfirm = async (req, res) => {
    await UserModal.updateOne({ _id: req.session.confirmEditUserManagement_id }, { $set: { status: req.session.confirmEditUserManagement_status } })
    req.session.confirmEditUserManagement_id = ''
    req.session.confirmEditUserManagement_status = ''
    res.redirect('/digiWorld/admin/userManagement')
}

const postDeleteUserManagement = async (req, res) => {
    req.session.deleteId = req.body.id,
        res.render('./admin/userManagement/confirmDeleteUserManagement')
}

const postDeleteConfirm = async (req, res) => {
    await UserModal.deleteOne({ _id: req.session.deleteId })
    req.session.deleteId = ''
    res.redirect('/digiWorld/admin/userManagement')
}

// ProductManagement =======================================================================================================

const getProductManagement = async (req, res) => {
    try {
        const products = await ProductModal.find().sort({ unitPrice: 1 })
        res.render('./admin/productManagement/productManagement', { products, productManagement: true })

    } catch (error) {
        console.log(error.message)

    }
}

const getCreateProductManagement = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const brand = await BrandModal.distinct('brandName')
            res.render('./admin/productManagement/createProduct', { brand })
        }
    } catch (error) {
        console.log(error.message)

    }
}

const postCreateProductManagement = async (req, res) => {
    try {
        let arrImages = []
        for (let i = 0; i < req.files.length; i++) {
            arrImages[i] = req.files[i].filename
        }

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
        res.redirect('/digiWorld/admin/productManagement')
    } catch (error) {
        console.log(error.message)

    }
}

const postUpdateStock = async (req, res) => {
    try {
        const productId = req.body.productId;
        const newQuantity = req.body.quantity;
        const updatedQuantity = await ProductModal.updateOne({ _id: productId }, { $set: { quantity: newQuantity } })
        res.json({ success: true, updatedQuantity });
    } catch (error) {
        console.log(error.message);
    }
}



// catagory management
const getBrandManagement = (req, res) => {
    try {
        if (req.session.isAdmin) {
            res.render('./admin/catagoryManagement/catagoryManagement', { catagoryManagement: true })
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/digiworld/admin/adminLogin')
        }
    } catch (error) {

    }
}

const getCreateBrand = (req, res) => {
    try {
        if (req.session.isAdmin) {
            if (req.session.brandCreation) {
                res.render('./admin/catagoryManagement/brandCreation', { brandCreation: req.session.brandCreation })
            } else {
                res.render('./admin/catagoryManagement/brandCreation')
            }

        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/digiworld/admin/adminLogin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const postCreateBrand = async (req, res) => {
    try {
        const newBrand = await BrandModal({
            brandName: req.body.brandName
        })
        await newBrand.save()
        req.session.brandCreation = 'Brand has created try new one'
        res.redirect('/digiWorld/admin/catagoryManagement/createBrand')

    } catch (error) {
        console.log(error.message);
    }
}
///bannerManagement
const getBannerManagement = (req, res) => {
    try {
        if (req.session.isAdmin) {
            res.render('./admin/bannerManagement/bannerManagement')
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/digiworld/admin/adminLogin')
        }
    } catch (error) {

    }
}

const getCreateBanner = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const brand = await BrandModal.distinct('brandName')
            res.render('./admin/bannerManagement/bannerCreation', { brand })
        } else {
            req.session.loginErrorMessage = 'Login First'
            res.redirect('/digiworld/admin/adminLogin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const postCreateBanner = async (req, res) => {
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
        res.redirect('/digiWorld/admin/bannerManagement')

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    // getAdminSignUp,
    // postAdminSignUp,
    getAdminLogin,
    postAdminLogin,
    getAdminOtpVerificationCode,
    postAdminOtpVerificationCode,
    getAdminPanel,
    postAdminLogout,
    getUserManagement,
    postEditUserManagement,
    postEditSubmit,
    postEditConfirm,
    postDeleteUserManagement,
    postDeleteConfirm,
    getProductManagement,
    getCreateProductManagement,
    postCreateProductManagement,
    postUpdateStock,
    getBrandManagement,
    getCreateBrand,
    postCreateBrand,
    getBannerManagement,
    getCreateBanner,
    postCreateBanner,
}