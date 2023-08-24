const AdminModel = require('../model/adminModel')
const UserModel = require('../model/userModel')
const BrandModel = require('../model/brandModal')
require('dotenv').config()
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')

////////////////

// const getAdminSignUp  = (req,res)=>{
//     res.render('./admin/adminSignUp')
// }

// const postAdminSignUp =async(req,res)=>{
//     console.log("postAdminSignUp  level1",);
//     let hash = await bcrypt.hash(req.body.password, 4)
//     const admin = await AdminModel({
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
        res.render('./admin/adminLogin', { unAutherisedAdmin: req.session.unAutherisedAdmin })
        req.session.unAutherisedAdmin = ""
    } else if (req.session.loginErrorMessage) {
        res.render('./admin/adminLogin', { loginErrorMessage: req.session.loginErrorMessage })
        req.session.loginErrorMessage = ""
    }
    else {
        res.render('./admin/adminLogin')
    }
}

const postAdminLogin = async (req, res) => {
    try {
        const adminData = await AdminModel.findOne({ userName: req.body.userName, isAdmin: true })
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
        res.render('./admin/adminOtpVerificationCode', { otpErrorMessage: req.session.otpErrorMessage })
    } else {
        res.render('./admin/adminOtpVerificationCode')
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
        res.render('./admin/adminPanel')
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
    const users = await UserModel.find()
    res.render('./admin/userManagement/userManagement', { users })
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
    await UserModel.updateOne({ _id: req.session.confirmEditUserManagement_id }, { $set: { status: req.session.confirmEditUserManagement_status } })
    req.session.confirmEditUserManagement_id = ''
    req.session.confirmEditUserManagement_status = ''
    res.redirect('/digiWorld/admin/userManagement')
}

const postDeleteUserManagement = async (req, res) => {
    req.session.deleteId = req.body.id,
        res.render('./admin/userManagement/confirmDeleteUserManagement')
}

const postDeleteConfirm = async (req, res) => {
    await UserModel.deleteOne({ _id: req.session.deleteId })
    req.session.deleteId = ''
    res.redirect('/digiWorld/admin/userManagement')
}

// CatagoryManagement =======================================================================================================

const getProductManagement = (req, res) => {
    try {
        res.render('./admin/productManagement/productManagement')

    } catch (error) {
        console.log(error.message)

    }
}

const getCreateProductManagement = (req, res) => {
    try {
        if (req.session.isAdmin) {
            res.render('./admin/productManagement/createProduct')
        }
    } catch (error) {
        console.log(error.message)

    }
}

const postCreateProductManagement = async (req, res) => {
    try {
        const newProduct = await BrandModel({
            brandName: req.body.brandName,
            product: [
                {
                    productName: req.body.productName,
                    quantity: req.body.quantity,
                    unitPrice: req.body.unitPrice,
                    // gallery: [...req.body.gallery],
                    discription: req.body.discription,
                    specification:{
                        frontCamera: req.body.frontCamera,
                        backCamera: req.body.backCamera,
                        ram: req.body.ram,
                        internalStorage: req.body.internalStorage,
                        battery: req.body.battery,
                        processor: req.body.processor,
                        chargerType: req.body.chargerType,
                    }
                    
                }
            ]

        })
        await newProduct.save()
        res.redirect('/digiWorld/admin/productManagement')
    } catch (error) {
        console.log(error.message)

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
}