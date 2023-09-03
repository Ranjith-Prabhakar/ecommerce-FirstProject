const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const BannerModal = require('../model/bannarModal')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')
require('dotenv').config()
const { errorHandler } = require('../middleWare/errorMiddleWare')



const userHome = async (req, res, next) => {
    try {
        if (req.session.userId) {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ freez: { $eq: 'active' } })
            let banner = await BannerModal.find()
            res.render('./users/userHome', { user, brands, products, banner })
        } else {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ freez: { $eq: 'active' } })
            let banner = await BannerModal.find()
            res.render('./users/userHome', { brands: brands, products, banner })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

///have to check it
const getSearch = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            res.redirect('/digiWorld/admin/adminPanel')
        }
        else if (req.session.userId) {
            let userName = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });

            let banner = await BannerModal.find()
            res.render('./users/userHome', { userName: userName.firstName, brands: brands, products, banner })/// 
        } else {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });

            let banner = await BannerModal.find()
            console.log(req.body.search);
            res.render('./users/userHome', { brands: brands, products, banner })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getUserLogin = async (req, res, next) => {
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
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const postUserLogin = async (req, res, next) => {
    try {
        const userData = await UserModal.findOne({ userName: req.body.userName })
        if (userData) {
            if (!userData.status) {
                req.session.block = 'you are blocked by admin'
                res.redirect('/userLogin')
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
                        res.redirect('/userOtpVerificationCode')
                    }
                });
            }
            else {
                bcrypt.compare(req.body.password, userData.password, async (err, result) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                    } else {
                        if (result) {
                            req.session.userId = userData._id
                            let hash = await bcrypt.hash(req.body.password, 2)
                            req.session.userHash = hash
                            res.cookie('userId', hash)
                            res.redirect('/Home',)
                        } else {
                            req.session.loginErrorMessage = 'invalid username or password'
                            res.redirect('/userLogin')
                        }
                    }
                });
            }

        } else {
            req.session.loginErrorMessage = 'invalid username or password'
            res.redirect('/userLogin')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}



const getUserSignUp = async (req, res, next) => {
    try {
        if (req.session.errorMessage) {
            res.render('./users/userSignUp', { errorMessage: req.session.errorMessage })
            req.session.errorMessage = ''
        } else {
            res.render('./users/userSignUp')
        }

    } catch (err) {
        errorHandler(err, req, res, next);
    }
}




const postUserSignUp = async (req, res, next) => {
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
        const validation = await UserModal.findOne({ $or: [{ userName: userName }, { email: email }] })
        if (validation) {
            if (!validation.isVerified) {
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        req.session.otp = otp
                        res.redirect('/userOtpVerificationCode')
                    }
                });
            } else {
                req.session.errorMessage = 'invalid userName or password'
                res.redirect('/userSignUp')
            }

        } else {
            let hash = await bcrypt.hash(req.body.password, 4)
            req.session.userEmail = req.body.email
            const newUser = await UserModal({
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
                    res.redirect('/userOtpVerificationCode')
                }
            });
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}




const getUserOtpVerificationCode = async (req, res, next) => {
    try {
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
    } catch (err) {
        errorHandler(err, req, res, next);
    }

}

const postUserOtpVerificationCode = async (req, res, next) => {

    try {
        if (req.body.otp === req.session.otp) {
            await UserModal.updateOne({ email: req.session.userEmail }, { $set: { isVerified: true } })
            req.session.userSignUpSuccess = 'signedUp successfully, Login Now'
            res.redirect('/userLogin')
            req.session.userEmail = ''
            req.session.otp = ''
        } else {
            req.session.otpErrorMessage = 'invalid otp'
            res.redirect('/userOtpVerificationCode')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }

}


const postUserLogOut = (req, res, next) => {
    try {
        if (req.session.isAdmin) {

            delete req.session.userId;
            res.clearCookie('userId')
            res.redirect('/Home')
        } else {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    res.clearCookie('userId')
                    res.redirect('/Home')
                }
            })
        }

    } catch (err) {
        errorHandler(err, req, res, next);
    }
}



// brand page
const getBrandPage = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.query.brandName, freez: { $eq: 'active' } })
            res.render('./users/brandPage', { brands, products })
        } else {
            let userName = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.query.brandName, freez: { $eq: 'active' } })
            res.render('./users/brandPage', { brands, products, userName: userName.firstName })
        }


    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

// filter
const getBrandFilter = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            let brand = []
            if (typeof req.query.brand === 'string') {
                brand.push(req.query.brand)
            } else {
                brand = [...req.query.brand]
            }
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...brand] }, freez: 'active' }).sort({ brandName: 1 })
            res.render('./users/productFilter', { filterProducts, brands })
        } else {
            let brand = []
            if (typeof req.query.brand === 'string') {
                brand.push(req.query.brand)
            } else {
                brand = [...req.query.brand]
            }
            let userName = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...brand] } }).sort({ brandName: 1 })
            res.render('./users/productFilter', { brands, filterProducts, userName: userName.firstName })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getSingleProductPage = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.query.id })
            res.render('./users/singleProduct', { brands, product })
        } else {
            let userName = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, firstName: 1 });
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.query.id })
            res.render('./users/singleProduct', { brands, product, userName: userName.firstName })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const user = await UserModal.findOne({ _id: req.query.userId })
        res.render('./users/userProfile', { user })
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}

const postaddProfileImage = async (req, res, next) => {
    try {
        await UserModal.updateOne({ _id: req.body.userId }, { $set: { profImage: req.file.filename } })
        res.redirect(`/profile?userId=${req.body.userId}`);
    } catch (error) {
        errorHandler(error, req, res, next);
    }
}

const postCreateAddress = async (req, res, next) => {
    try {

        const formDataObject = req.body.formDataObject; // Assign formDataObject from request body

        await UserModal.updateOne(
            { _id: formDataObject.userId },
            { $push: { shippingAddress: formDataObject } }
        );
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

const postEditAddress = async (req, res, next) => {
    try {
        let userId = req.body.newAddressFormData.userId
        let index = req.body.index
        let newObject = req.body.newAddressFormData
        delete newObject.userId
        await UserModal.updateOne({ _id: userId }, { $set: { [`shippingAddress.${index}`]: newObject } })
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const postDeleteAddress = async (req, res, next) => {
    try {
        const { userId, index, objectId } = req.body
        await UserModal.updateOne({ _id: userId }, { $pull: { shippingAddress: { _id: objectId } } });
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
//cart
const getCart = async (req, res, next) => {
    try {
        const user = await UserModal.findOne({ _id: req.session.userId });
        const cartItems = user.cart; // Get the cart items array

        // Create an array to hold cart items with product data and quantity
        const cartProductPromises = cartItems.map(async (cartItem) => {
            const product = await ProductModal.findOne({ _id: cartItem.productId });
            product.cartQuantity = cartItem.quantity; // Set the quantity property of the product
            return product;
        });


        // Use Promise.all to wait for all product data to be fetched
        const cartProducts = await Promise.all(cartProductPromises);
      

        res.render('./users/cart', { cartProducts }); // Pass cartProducts to the EJS template
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};




const postAddToCart = async (req, res, next) => {
    try {
        let count = req.body.count ? req.body.count : 1
        let result = await UserModal.updateOne({  _id: req.body.userId,"cart": {$not: { $elemMatch: { productId: req.body.productId }}}},
            {$addToSet: {  cart: { productId: req.body.productId,quantity: count} }})
            console.log(result);
            if(result.modifiedCount === 1){
                res.json({ success: true })
            }else if (result.modifiedCount === 0){
                res.json({ success: false })
            }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const postUpdateCartProductQty = async (req, res, next) => {
    try {
        const userId = req.session.userId;
       
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        console.log(userId,productId,quantity);
        const result = await UserModal.updateOne(
            { _id: userId, 'cart.productId': productId },
            { $set: { 'cart.$.quantity': quantity } }
        );
        if (result.modifiedCount === 1) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Product quantity not updated.' });
        }
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

const postRemoveFromCart = async(req,res,next)=>{
    try {
        const result = await UserModal.updateOne({_id: req.session.userId, cart: {$elemMatch: {productId: req.body.productId}}}, {$pull: {cart: {productId: req.body.productId}}});
        if(result.modifiedCount === 1){
            res.json({success:true})
        }else if(result.modifiedCount === 0){
            res.json({success:false})
        }
    } catch (error) {
        errorHandler(error,req,res,next)
        
    }
}

module.exports = {
    userHome,
    getSearch,
    getUserSignUp,
    postUserSignUp,
    getUserOtpVerificationCode,
    postUserOtpVerificationCode,
    getUserLogin,
    postUserLogin,
    postUserLogOut,
    getBrandFilter,
    getBrandPage,
    getSingleProductPage,
    getProfile,
    postaddProfileImage,
    postCreateAddress,
    postEditAddress,
    postDeleteAddress,
    getCart,
    postAddToCart,
    postUpdateCartProductQty,
    postRemoveFromCart
}