const UserModel = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const BannerModal = require('../model/bannarModal')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')
require('dotenv').config()



const userHome = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            res.redirect('/digiWorld/admin/adminPanel')
        }
        else if (req.session.userId) {
            let userName = await UserModel.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find()
            let banner = await BannerModal.find()
            res.render('./users/userHome', { userName: userName.firstName, brands: brands, products,banner })/// 
        } else {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find()
            let banner = await BannerModal.find()
            res.render('./users/userHome', { brands: brands, products,banner})
        }
    } catch (error) {
        console.log(error.message);
    }
}
///have to check it
// const postSearch = async (req, res) => {
//     try {
//         if (req.session.isAdmin) {
//             res.redirect('/digiWorld/admin/adminPanel')
//         }
//         else if (req.session.userId) {
//             let userName = await UserModel.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
//             let brands = await BrandModal.distinct('brandName')
//             let products = await ProductModal.find({ productName: { $regex: new RegExp(`^${req.body.search}`, 'i') } })
//             res.render('./users/userHome', { userName: userName.firstName, brands: brands, products })/// 
//         } else {
//             let brands = await BrandModal.distinct('brandName')
//             let products = await ProductModal.find({ productName: { $regex: new RegExp(`^${req.body.search}`, 'i') } })
//             console.log(req.body.search);
//             res.render('./users/userHome', { brands: brands, products })
//         }
//     } catch (error) {
//         console.log(error.message);

//     }
// }

const getUserLogin = async (req, res) => {
    try {
        if (req.session.userSignUpSuccess) {
            res.render('./users/userLogin', { userSignUpSuccess: req.session.userSignUpSuccess })
            req.session.userSignUpSuccess = ''
        } else if (req.session.loginErrorMessage) {
            res.render('./users/userLogin', { loginErrorMessage: req.session.loginErrorMessage })
            req.session.loginErrorMessage = ''
        } else if (req.session.block) {
            res.render('./users/userLogin', { block: req.session.block })
            req.session.block = ''
        } else {
            res.render('./users/userLogin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const postUserLogin = async (req, res) => {
    try {
        const userData = await UserModel.findOne({ userName: req.body.userName })
        if (userData) {
            if (!userData.status) {
                req.session.block = 'you are blocked by admin'
                res.redirect('/digiWorld/user/userLogin')
            } else if (!userData.isVerified) {
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
                    to: userData.email, // Recipient email
                    subject: 'OTP Verification Code',
                    text: `Your OTP is: ${otp}`,
                };
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        req.session.otp = otp
                        req.session.userEmail = userData.email
                        req.session.notVerified = 'you have to verify fist to login'
                        res.redirect('/digiworld/user/userOtpVerificationCode')
                    }
                });
            }
            else {
                bcrypt.compare(req.body.password, userData.password, (err, result) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                    } else {
                        if (result) {
                            req.session.userId = userData._id
                            res.cookie('password', req.body.password)
                            res.redirect('/digiWorld/user/userHome',)
                        } else {
                            req.session.loginErrorMessage = 'invalid username or password'
                            res.redirect('/digiWorld/user/userLogin')
                        }
                    }
                });
            }

        } else {
            req.session.loginErrorMessage = 'invalid username or password'
            res.redirect('/digiWorld/user/userLogin')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const getUserSignUp = async (req, res) => {
    try {
        if (req.session.errorMessage) {
            res.render('./users/userSignUp', { errorMessage: req.session.errorMessage })
            req.session.errorMessage = ''
        } else {
            res.render('./users/userSignUp')
        }

    } catch (error) {
        console.log(error.message);
    }
}




const postUserSignUp = async (req, res) => {
    try {
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
            to: req.body.email, // Recipient email
            subject: 'OTP Verification Code',
            text: `Your OTP is: ${otp}`,
        };

        const { userName, email } = req.body
        const validation = await UserModel.findOne({ $or: [{ userName: userName }, { email: email }] })
        if (validation) {
            if (!validation.isVerified) {
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        req.session.otp = otp
                        res.redirect('/digiworld/user/userOtpVerificationCode')
                    }
                });
            } else {
                req.session.errorMessage = 'invalid userName or password'
                res.redirect('/digiworld/user/userSignUp')
            }

        } else {
            let hash = await bcrypt.hash(req.body.password, 4)
            req.session.userEmail = req.body.email
            const newUser = await UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                userName: req.body.userName,
                password: hash,
            })
            const user = await newUser.save()


            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    req.session.otp = otp
                    res.redirect('/digiworld/user/userOtpVerificationCode')
                }
            });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}




const getUserOtpVerificationCode = async (req, res) => {
    if (req.session.otpErrorMessage) {
        res.render('./users/userOtpVerificationCode', { otpErrorMessage: req.session.otpErrorMessage })
        req.session.otpErrorMessage = ''
    } else if (req.session.notVerified) {
        res.render('./users/userOtpVerificationCode', { notVerified: req.session.notVerified })
        req.session.notVerified = ''
    }
    else {
        res.render('./users/userOtpVerificationCode')
    }

}

const postUserOtpVerificationCode = async (req, res) => {

    if (req.body.otp === req.session.otp) {
        await UserModel.updateOne({ email: req.session.userEmail }, { $set: { isVerified: true } })
        req.session.userSignUpSuccess = 'signedUp successfully, Login Now'
        res.redirect('/digiWorld/user/userLogin')
        req.session.userEmail = ''
        req.session.otp = ''
    } else {
        req.session.otpErrorMessage = 'invalid otp'
        res.redirect('/digiworld/user/userOtpVerificationCode')
    }

}


const postUserLogOut = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
            } else {
                res.clearCookie('password')
                res.redirect('/digiWorld/user/userHome')
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}



// brand page
const postBrandPage = async (req, res) => {
    try {
        if (!req.session.userId) {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.body.brandName })
            res.render('./users/brandPage', { brands, products })
        } else {
            let userName = await UserModel.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.body.brandName })
            res.render('./users/brandPage', { brands, products, userName: userName.firstName })
        }


    } catch (error) {
        console.log(error.message)

    }
}

// filter
const postBrandFilter = async (req, res) => {
    try {
        if (!req.session.userId) {
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...req.body.brand] } }).sort({ brandName: 1 })
            res.render('./users/productFilter', { filterProducts, brands })
        } else {
            let userName = await UserModel.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...req.body.brand] } }).sort({ brandName: 1 })
            res.render('./users/productFilter', { brands, filterProducts, userName: userName.firstName })
        }
    } catch (error) {
        console.log(error.message);

    }
}

const postSingleProductPage = async (req, res) => {
    try {
        if (!req.session.userId) {
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.body.id })
            res.render('./users/singleProduct', { brands, product })
        } else {
            let userName = await UserModel.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.body.id })
            res.render('./users/singleProduct', { brands, product, userName: userName.firstName })
        }
    } catch (error) {
        console.log(error.message);

    }
}

module.exports = {
    userHome,
    // postSearch,
    getUserSignUp,
    postUserSignUp,
    getUserOtpVerificationCode,
    postUserOtpVerificationCode,
    getUserLogin,
    postUserLogin,
    postUserLogOut,
    postBrandFilter,
    postBrandPage,
    postSingleProductPage
}