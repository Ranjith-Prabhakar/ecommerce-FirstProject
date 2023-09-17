const AdminModal = require('../model/adminModal')
require('dotenv').config()
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const { errorHandler } = require('../middleWare/errorMiddleWare')

////////////////==============================================================================================

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


////////////////==============================================================================================

const getAdminLogin = (req, res, next) => {
    try {
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
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

// const postAdminLogin = async (req, res) => {
//     try {
//         const adminData = await AdminModal.findOne({ userName: req.body.userName, isAdmin: true })
//         if (adminData) {
//             bcrypt.compare(req.body.password, adminData.password, (err, result) => {
//                 if (err) {
//                     console.error('Error comparing passwords:', err);
//                 } else {
//                     if (result) {

//                         // Create a Nodemailer transporter
//                         let transporter = nodeMailer.createTransport({
//                             service: "gmail",
//                             auth: {
//                                 user: process.env.nodeMailerEmail,
//                                 pass: process.env.nodeMailerEmailPassword
//                             }
//                         })

//                         // Generate a random OTP
//                         const otp = randomString.generate({
//                             length: 6,
//                             charset: 'numeric',
//                         });
//                         // Define the email content
//                         const mailOptions = {
//                             from: process.env.nodeMailerEmail, // Sender email
//                             to: adminData.email, // Recipient email
//                             subject: 'OTP Verification Code',
//                             text: `Your OTP is: ${otp}`,
//                         };
//                         // Send the email
//                         transporter.sendMail(mailOptions, (error, info) => {
//                             if (error) {
//                                 console.log('Error sending email:', error);
//                             } else {
//                                 req.session.otp = otp
//                                 res.redirect('/adminOtpVerificationCode')
//                             }
//                         });
//                     } else {
//                         req.session.unAutherisedAdmin = 'You are  unautherised to login'
//                         res.redirect('/adminLogin')
//                     }
//                 }
//             });
//         } else {
//             req.session.loginErrorMessage = 'invalid username or password'
//             res.redirect('/digiWorld/admin/adminLogin')
//         }


//     } catch (error) {
//         errorHandler(err, req, res, next);
//     }
// }
const postAdminLogin = async (req, res) => {
    try {
        const adminData = await AdminModal.findOne({ userName: req.body.userName, isAdmin: true })
        if (adminData) {
            bcrypt.compare(req.body.password, adminData.password, async(err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                } else {
                    if (result) {
                        req.session.isAdmin = true

                        let hash = await bcrypt.hash('helloworld',2)
                        req.session.adminHash = hash
            
                        res.cookie('password',hash )
                        res.redirect('/adminPanel')
                    } else {
                        req.session.unAutherisedAdmin = 'You are  unautherised to login'
                        res.redirect('/adminLogin')
                    }
                }
            });
        } else {
            req.session.loginErrorMessage = 'invalid username or password'
            res.redirect('/digiWorld/admin/adminLogin')
        }


    } catch (error) {
        errorHandler(err, req, res, next);
    }
}



// const getAdminOtpVerificationCode = async (req, res) => {
//     try {
//         if (req.session.otpErrorMessage) {
//             res.render('./admin/adminOtpVerificationCode', { otpErrorMessage: req.session.otpErrorMessage, otp: true })/////
//         } else {
//             res.render('./admin/adminOtpVerificationCode', { otp: true })/////
//         }
//     } catch (err) {
//         errorHandler(err, req, res, next);
//     }

// }



// const postAdminOtpVerificationCode = async (req, res) => {
//     try {
//         if (req.body.otp === req.session.otp) {
//             req.session.otp = ''
//             req.session.isAdmin = true

//             let hash = await bcrypt.hash('helloworld',2)
//             req.session.adminHash = hash

//             res.cookie('password',hash )
//             res.redirect('/adminPanel')
//         } else {
//             req.session.otpErrorMessage = 'invalid otp'
//             res.redirect('/adminOtpVerificationCode')
//         }
//     } catch (err) {
//         errorHandler(err, req, res, next);
//     }
// }

const getAdminPanel = (req, res) => {

    try {
        if (req.session.isAdmin) {
            res.render('./admin/adminPanel', { adminPanel: true })
        } else {
            req.body.unAutherisedAdmin = 'login first'
            res.redirect('/adminLogin')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postAdminLogout = (req, res) => {
    try {


        if (req.session.userId) {
            delete req.session.isAdmin
            res.clearCookie('password')
            res.redirect('/adminLogin')
        } else {

            req.session.destroy((err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    res.clearCookie('password')
                    res.redirect('/adminLogin')
                }
            })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}




module.exports = {
    // getAdminSignUp,
    // postAdminSignUp,
    getAdminLogin,
    postAdminLogin,
    // getAdminOtpVerificationCode,
    // postAdminOtpVerificationCode,
    getAdminPanel,
    postAdminLogout,




}