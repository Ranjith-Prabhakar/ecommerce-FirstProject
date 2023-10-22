const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const BannerModal = require('../model/bannarModal')
const CouponModal = require('../model/couponModal')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')
require('dotenv').config()
const { errorHandler } = require('../middleWare/errorMiddleWare')
// global variables
let errorMessages
//razorpay
const Razorpay = require('razorpay');
const userModal = require('../model/userModal')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});
const userHome = async (req, res, next) => {
    try {
        const page = req.params.paramName ? parseInt(req.params.paramName) : 0; // it was one before then it worked well
        const itemsPerPage = 5; // Number of products per page
        // const start = (page - 1) * itemsPerPage;
        const start = Math.abs((page - 1) * itemsPerPage);
        let user, brands, products, productsCount, banner;
        if (req.session.userId) {
            user = await UserModal.findOne({ _id: req.session.userId });
            brands = await BrandModal.distinct('brandName')
            products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage);
            productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
            banner = await BannerModal.find()
            res.render('users/userHome', { user, brands, products, banner, productsCount, page })
        } else {
            brands = await BrandModal.distinct('brandName')
            products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage);
            productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
            banner = await BannerModal.find()
            res.render('users/userHome', { brands: brands, products, banner, productsCount, page })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const getUserHomeSort = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page)  // it was one before then it worked well
        const itemsPerPage = 5; // Number of products per page
        // const start = (page - 1) * itemsPerPage;
        const start = Math.abs((page - 1) * itemsPerPage);
        let user, brands, products, productsCount, banner;
        let sortValue = parseInt(req.query.sortValue)
        if (req.query.criteria === "unitPrice") {
            if (req.session.userId) {
                user = await UserModal.findOne({ _id: req.session.userId });
                brands = await BrandModal.distinct('brandName')
                products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage).sort({ unitPrice: sortValue });
                productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
                banner = await BannerModal.find()
                res.render('users/sortUserHome', { user, brands, products, banner, productsCount, page, sortValue, criteria: req.query.criteria })
            } else {
                brands = await BrandModal.distinct('brandName')
                products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage).sort({ unitPrice: sortValue });
                productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
                banner = await BannerModal.find()
                res.render('users/sortUserHome', { brands: brands, products, banner, productsCount, page, sortValue, criteria: req.query.criteria })
            }
        } else {
            if (req.session.userId) {
                user = await UserModal.findOne({ _id: req.session.userId });
                brands = await BrandModal.distinct('brandName')
                products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage).sort({ createdAt: sortValue });
                productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
                banner = await BannerModal.find()
                res.render('users/sortUserHome', { user, brands, products, banner, productsCount, page, sortValue, criteria: req.query.criteria })
            } else {
                brands = await BrandModal.distinct('brandName')
                products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage).sort({ createdAt: sortValue });
                productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
                banner = await BannerModal.find()
                res.render('users/sortUserHome', { brands: brands, products, banner, productsCount, page, sortValue, criteria: req.query.criteria })
            }
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const getSearch = async (req, res, next) => {
    try {
        if (req.session.userId) {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });
            res.render('users/productSearch', { user, brands: brands, products, brand: req.query.search })/// 
        } else {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });
            res.render('users/productSearch', { brands: brands, products, brand: req.query.search })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const getBrandSort = async (req, res, next) => {
    try {
        let criteria = req.query.criteria
        if (criteria === "unitPrice") {
            if (req.session.userId) {
                let user = await UserModal.findOne({ _id: req.session.userId });
                let brands = await BrandModal.distinct('brandName')
                let products = await ProductModal.find({ brandName: { $regex: new RegExp(`^${req.query.brand}`, 'i') }, freez: 'active' }
                ).sort({ unitPrice: parseInt(req.query.sortValue) });
                res.render('users/productSearch', { user, brands: brands, products, brand: req.query.brand })/// 
            } else {
                let brands = await BrandModal.distinct('brandName')
                let products = await ProductModal.find({ brandName: { $regex: new RegExp(`^${req.query.brand}`, 'i') }, freez: 'active' }
                ).sort({ unitPrice: parseInt(req.query.sortValue) });
                res.render('users/productSearch', { brands: brands, products, brand: req.query.brand })
            }
        } else if (criteria === "createdAt") {
            if (req.session.userId) {
                let user = await UserModal.findOne({ _id: req.session.userId });
                let brands = await BrandModal.distinct('brandName')
                let products = await ProductModal.find({ brandName: { $regex: new RegExp(`^${req.query.brand}`, 'i') }, freez: 'active' }
                ).sort({ createdAt: req.query.sortValue });
                res.render('users/productSearch', { user, brands: brands, products, brand: req.query.brand })/// 
            } else {
                let brands = await BrandModal.distinct('brandName')
                let products = await ProductModal.find({ brandName: { $regex: new RegExp(`^${req.query.brand}`, 'i') }, freez: 'active' }
                ).sort({ createdAt: req.query.sortValue });
                res.render('users/productSearch', { brands: brands, products, brand: req.query.brand })
            }
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const getFilterBrandSort = async (req, res, next) => {
    try {
        let brandString = req.query.brand.split(',')
        let criteria = req.query.criteria
        if (criteria === "unitPrice") {
            if (req.session.userId) {
                let user = await UserModal.findOne({ _id: req.session.userId });
                let brands = await BrandModal.distinct('brandName')
                let filterProducts = await ProductModal.find({ brandName: { $in: brandString } }).sort({ unitPrice: parseInt(req.query.sortValue) });
                res.render('users/productFilter', { user, brands: brands, filterProducts, brand: brandString })/// 
            } else {
                let brands = await BrandModal.distinct('brandName')
                let filterProducts = await ProductModal.find({ brandName: { $in: brandString } }).sort({ unitPrice: parseInt(req.query.sortValue) });
                res.render('users/productFilter', { brands: brands, filterProducts, brand: brandString })
            }
        } else if (criteria === "createdAt") {
            if (req.session.userId) {
                let user = await UserModal.findOne({ _id: req.session.userId });
                let brands = await BrandModal.distinct('brandName')
                let filterProducts = await ProductModal.find({ brandName: { $in: brandString } }).sort({ createdAt: parseInt(req.query.sortValue) });
                res.render('users/productFilter', { user, brands: brands, filterProducts, brand: brandString })/// 
            } else {
                let brands = await BrandModal.distinct('brandName')
                let filterProducts = await ProductModal.find({ brandName: { $in: brandString } }).sort({ createdAt: parseInt(req.query.sortValue) });
                res.render('users/productFilter', { brands: brands, filterProducts, brand: brandString })
            }
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
};
const getUserLogin = async (req, res, next) => {
    try {
        if (errorMessages) {
            res.render('users/userLogin', { errorMessages })
            errorMessages = ""
        }
        else {
            res.render('users/userLogin')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const postUserLogin = async (req, res, next) => {
    try {
        const userData = await UserModal.findOne({ email: req.body.email })
        if (userData) {
            if (!userData.status) {
                errorMessages = 'you are blocked by admin'
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
                        errorMessages = 'you have to verify fist to login'
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
                            res.redirect('/',)
                        } else {
                            errorMessages = 'invalid username or password'
                            res.redirect('/userLogin')
                        }
                    }
                });
            }
        } else {
            errorMessages = 'invalid username or password'
            res.redirect('/userLogin')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const getUserSignUp = async (req, res, next) => {
    try {
        if (req.session.errorMessage) {
            res.render('users/userSignUp', { errorMessage: req.session.errorMessage, signUp: true })
            req.session.errorMessage = ''
        } else {
            res.render('users/userSignUp', { signUp: true })
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
        const { email } = req.body
        // const validation = await UserModal.findOne({ $or: [{ userName: userName }, { email: email }] })
        const validation = await UserModal.findOne({ email: email })
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
            }
        } else {
            let hash = await bcrypt.hash(req.body.password, 4)
            req.session.userEmail = req.body.email
            const newUser = await UserModal({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
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
        if (errorMessages) {
            res.render('users/userOtpVerificationCode', { errorMessages })
            errorMessages = ''
        } else if (errorMessages) {
            res.render('users/userOtpVerificationCode', { errorMessages })
            errorMessages = ''
        }
        else {
            res.render('users/userOtpVerificationCode')
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const getResendOtp = async (req, res, next) => {
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
        let reotp = randomString.generate({
            length: 6,
            charset: 'numeric',
        });
        // Define the email content
        const mailOptions = {
            from: process.env.nodeMailerEmail, // Sender email
            to: req.session.userEmail, // Recipient email
            subject: 'OTP Verification Code',
            text: `Your OTP is: ${reotp}`,
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                // console.log('here in test place=====');
                // console.log("req.session ===>", req.session.otp);
                // delete req.session.otp
                // console.log("req.session ===>", req.session.otp);

                // console.log('req.session.otp, first ===>', req.session.otp);
            }

        });
        req.session.otp = reotp
        res.json({ success: true })
    } catch (error) {
        errorHandler(req, res, next)
    }
}
const postUserOtpVerificationCode = async (req, res, next) => {
    try {
        if (req.body.otp === req.session.otp) {
            await UserModal.updateOne({ email: req.session.userEmail }, { $set: { isVerified: true } })
            errorMessages = 'signedUp successfully, Login Now'
            res.redirect('/userLogin')
            req.session.userEmail = ''
            req.session.otp = ''
        } else {
            errorMessages = 'invalid otp'
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
            res.redirect('/')
        } else {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    res.clearCookie('userId')
                    res.redirect('/')
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
            res.render('users/brandPage', { brands, products, brand: req.query.brandName })
        } else {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.query.brandName, freez: { $eq: 'active' } })
            res.render('users/brandPage', { brands, products, user, brand: req.query.brandName })
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
            res.render('users/productFilter', { filterProducts, brands, brand })
        } else {
            let brand = []
            if (typeof req.query.brand === 'string') {
                brand.push(req.query.brand)
            } else {
                brand = [...req.query.brand]
            }
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...brand] } }).sort({ brandName: 1 })
            res.render('users/productFilter', { brands, filterProducts, user, brand })
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
            let rating = {}
            if (product && product.rating && product.rating.length > 0) {
                rating.rateLength = product.rating.length
                rating.rateSum = product.rating.reduce((rate, element) => {
                    return rate + element.rate
                }, 0)
            } else {
                console.log("Rating data is missing or empty.");
            }
            let avg = (rating.rateSum / (rating.rateLength * 5)) * 100
            let ratingAvg = (5 / 100) * avg
            res.render('users/singleProduct', { brands, product, ratingAvg })
        } else {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.query.id })
            let rating = {}
            if (product && product.rating && product.rating.length > 0) {
                rating.rateLength = product.rating.length
                rating.rateSum = product.rating.reduce((rate, element) => {
                    return rate + element.rate
                }, 0)
            } else {
                console.log("Rating data is missing or empty.");
            }
            let avg = (rating.rateSum / (rating.rateLength * 5)) * 100
            let ratingAvg = (5 / 100) * avg
            res.render('users/singleProduct', { brands, product, user, ratingAvg })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const user = await UserModal.findOne({ _id: req.session.userId })
        let brands = await BrandModal.distinct('brandName')
        res.render('users/userProfile', { user, brands })
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
            { _id: req.session.userId },
            { $push: { shippingAddress: { $each: [formDataObject], $position: 0 } } }
        );
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};
const postEditAddress = async (req, res, next) => {
    try {
        if (req.body.userObject) {
            let { firstName, lastName, email, phone } = req.body.userObject
            await UserModal.updateOne({ _id: req.session.userId }, {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                }
            })
            userObject = ""
            res.json({ success: true })
        } else {
            let userId = req.session.userId
            let index = req.body.index
            let newObject = req.body.newAddressFormData
            delete newObject.userId
            await UserModal.updateOne({ _id: userId }, { $set: { [`shippingAddress.${index}`]: newObject } })
            res.json({ success: true })
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postDeleteAddress = async (req, res, next) => {
    try {
        const { userId, index, objectId } = req.body
        await UserModal.updateOne({ _id: req.session.userId }, { $pull: { shippingAddress: { _id: objectId } } });
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
//cart
const getCart = async (req, res, next) => {
    try {
        let brands = await BrandModal.distinct('brandName')
        const user = await UserModal.findOne({ _id: req.session.userId });
        const cartItems = user.cart; // Get the cart items array
        let cartValue = 0
        // Create an array to hold cart items with product data and quantity
        const cartProductPromises = cartItems.map(async (cartItem) => {
            const product = await ProductModal.findOne({ _id: cartItem.productId });
            product.cartQuantity = cartItem.quantity; // Set the quantity property of the product
            cartValue += parseFloat(product.unitPrice * product.cartQuantity)
            return product;
        });
        // Use Promise.all to wait for all product data to be fetched
        const cartProducts = await Promise.all(cartProductPromises);
        res.render('users/cart', { cartProducts, cartValue, user, brands }); // Pass cartProducts to the EJS template
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};
const postAddToCart = async (req, res, next) => {
    try {
        let count = req.body.count ? req.body.count : 1
        let result = await UserModal.updateOne({ _id: req.body.userId, "cart": { $not: { $elemMatch: { productId: req.body.productId } } } },
            { $addToSet: { cart: { productId: req.body.productId, quantity: count } } })
        if (result.modifiedCount === 1) {
            res.json({ success: true })
        } else if (result.modifiedCount === 0) {
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
const postRemoveFromCart = async (req, res, next) => {
    try {
        const result = await UserModal.updateOne({ _id: req.session.userId, cart: { $elemMatch: { productId: req.body.productId } } }, { $pull: { cart: { productId: req.body.productId } } });
        if (result.modifiedCount === 1) {
            res.json({ success: true })
        } else if (result.modifiedCount === 0) {
            res.json({ success: false })
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const getCheckOutPage = async (req, res, next) => {
    try {
        if (req.query.productId) {//singleProduct
            let singleProduct = await ProductModal.findOne({ _id: req.query.productId });
            let coupons = {}
            const productCoupon = await CouponModal.find({ active: true, criteria: 'product' })
            if (productCoupon) {
                let productValidation = productCoupon.find(productCoupon => productCoupon.product === singleProduct.productName)
                if (productValidation) {
                    coupons.productCoupon = productValidation
                } else {
                    const brandCoupon = await CouponModal.find({ active: true, criteria: 'brand' })
                    let brandValidation = brandCoupon.find(brandCoupon => brandCoupon.brand === singleProduct.brandName)
                    if (brandValidation) {
                        coupons.brandCoupon = brandValidation
                    }
                }
            } else {
                const brandCoupon = await CouponModal.find({ active: true, criteria: 'brand' })
                let brandValidation = brandCoupon.find(brandCoupon => brandCoupon.brand === singleProduct.brandName)
                if (brandValidation) {
                    coupons.brandCoupon = brandValidation
                }
            }
            let user = await UserModal.findOne({ _id: req.session.userId })
            let brands = await BrandModal.distinct('brandName')
            res.render('users/checkOutPage', { singleProduct, user, brands, coupons });
            req.query.productId = '';
        } else if (req.session.selectedProducts && req.session.selectedProducts.length) {//selected cart
            let coupons = {}
            let user = await UserModal.findOne({ _id: req.session.userId })
            let brands = await BrandModal.distinct('brandName')
            let productIds = req.session.selectedProducts.map((product) => product.productId);
            let matchingProducts = await ProductModal.find({ _id: { $in: productIds } });
            let productList = matchingProducts.map((product) => {
                let selectedProduct = req.session.selectedProducts.find((selected) => selected.productId === product._id.toString());
                if (selectedProduct) {
                    return {
                        ...product.toObject(),
                        orderQuantity: selectedProduct.productQuantity,
                    };
                } else {
                    return product.toObject();
                }
            });
            req.session.selectedProducts.length = 0;
            req.session.productList = productList
            const priceCoupon = await CouponModal.find({ active: true, criteria: 'price' })
            let total = productList.reduce((sum, productListElement) => {
                let orderQuantity = productListElement.orderQuantity;
                let unitPrice = productListElement.unitPrice;
                // Check if orderQuantity and unitPrice are defined and not empty
                if (orderQuantity && unitPrice) {
                    orderQuantity = parseFloat(orderQuantity.trim());
                    unitPrice = parseFloat(unitPrice.trim());
                    // Check if the parsing was successful and both values are numbers
                    if (!isNaN(orderQuantity) && !isNaN(unitPrice)) {
                        return sum + (orderQuantity * unitPrice);
                    }
                }
                // If any check fails, return the current sum without adding anything
                return sum;
            }, 0);
            let matchingPriceCoupons = priceCoupon.filter((priceCoupon) => {
                return priceCoupon.amountRange < total
            })
            coupons.priceCoupons = matchingPriceCoupons
            res.render('users/checkOutPage', { productList, user, brands, coupons });
        } else if (req.query.cart) {//cart
            let coupons = {}
            const user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            const cart = user.cart;
            const productIds = cart.map((item) => item.productId);
            const matchingProducts = await ProductModal.find({ _id: { $in: productIds }, quantity: { $gt: 0 } });
            let productList = matchingProducts.map((product) => {
                cart.forEach((cart) => {
                    if (cart.productId.equals(product._id)) {
                        product.orderQuantity = cart.quantity
                    }
                })
                return product
            })
            req.query.cart = false;
            req.session.productList = productList
            const priceCoupon = await CouponModal.find({ active: true, criteria: 'price' })
            // let sessionProductList = req.session.productList //because
            let total = productList.reduce((sum, productListElement) => {
                let orderQuantity = productListElement.orderQuantity;
                let unitPrice = productListElement.unitPrice;
                // Check if orderQuantity and unitPrice are defined and not empty
                if (orderQuantity && unitPrice) {
                    orderQuantity = orderQuantity;
                    unitPrice = unitPrice;
                    // Check if the parsing was successful and both values are numbers
                    if (!isNaN(orderQuantity) && !isNaN(unitPrice)) {
                        return sum + (orderQuantity * unitPrice);
                    }
                }
                // If any check fails, return the current sum without adding anything
                return sum;
            }, 0);
            let matchingPriceCoupons = priceCoupon.filter((priceCoupon) => {
                return priceCoupon.amountRange < total
            })
            let matchingPriceCouponsFiltered = matchingPriceCoupons.reduce((max, obj) => {
                return obj.amountRange > max.amountRange ? obj : max
            }, priceCoupon[0])
            coupons.priceCoupons = matchingPriceCoupons
            res.render('users/checkOutPage', { productList, user, brands, coupons });
        }
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};
const postBuySelectedProducts = (req, res, next) => {
    try {
        req.session.selectedProducts = req.body.selectedProducts
        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
//////
const postOrderPlacement = async (req, res, next) => {
    try {
        if (req.body.newFormData) {
            if (req.body.newFormData.razorpay_payment_id && req.body.newFormData.razorpay_order_id) {
                if (req.body.newFormData.couponId) {
                    if (req.body.newFormData.walletDebit) {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                        razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                        razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                        couponId: req.body.newFormData.couponId,
                                        couponValue: req.body.newFormData.couponValue,
                                        walletDebit: req.body.newFormData.walletDebit,
                                        balanceToSettle: {
                                            balance: 0,
                                            settledMode: 'upi'
                                        }
                                    }], $position: 0
                                }
                            }

                        })
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $inc: {
                                "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                            },
                            $push: {
                                "wallet.transaction": {
                                    $each: [
                                        {
                                            typeOfTransaction: 'debit',
                                            amount: parseFloat(req.body.newFormData.walletDebit)
                                        }
                                    ], $position: 0

                                }
                            }
                        })
                    } else {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment,
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                        razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                        razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                        couponId: req.body.newFormData.couponId,
                                        couponValue: req.body.newFormData.couponValue,
                                        balanceToSettle: {
                                            balance: 0,
                                            settledMode: 'upi'
                                        }
                                    }], $position: 0
                                }
                            }
                        })
                    }
                } else {
                    if (req.body.newFormData.walletDebit) {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{ //////
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total),
                                        razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                        razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                        walletDebit: req.body.newFormData.walletDebit,
                                        balanceToSettle: {
                                            balance: 0,
                                            settledMode: 'upi'
                                        }
                                    }], $position: 0
                                }
                            }

                        })
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $inc: {
                                "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                            },
                            $push: {
                                "wallet.transaction": {
                                    $each: [
                                        {
                                            typeOfTransaction: 'debit',
                                            amount: parseFloat(req.body.newFormData.walletDebit)
                                        }
                                    ], $position: 0

                                }
                            }
                        })
                    } else {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment,
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: req.body.newFormData.total,
                                        razorpay_payment_id: req.body.newFormData.razorpay_payment_id,
                                        razorpay_order_id: req.body.newFormData.razorpay_order_id,
                                        balanceToSettle: {
                                            balance: 0,
                                            settledMode: 'upi'
                                        }
                                    }], $position: 0
                                }
                            },
                        })
                    }
                }


            } else {////////////////////////////////////////////////
                if (req.body.newFormData.couponId) {
                    if (req.body.newFormData.walletDebit) {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                        couponId: req.body.newFormData.couponId,
                                        couponValue: req.body.newFormData.couponValue,
                                        walletDebit: req.body.newFormData.walletDebit,
                                        balanceToSettle: {
                                            balance: req.body.newFormData.balaceToPay

                                        }
                                    }], $position: 0
                                }
                            }

                        })
                        // +====
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $inc: {
                                "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                            },
                            $push: {
                                "wallet.transaction": {
                                    $each: [
                                        {
                                            typeOfTransaction: 'debit',
                                            amount: parseFloat(req.body.newFormData.walletDebit)
                                        }
                                    ], $position: 0

                                }
                            }
                        })
                    } else { //////////////
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment,
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total) + parseInt(req.body.newFormData.couponValue),
                                        couponId: req.body.newFormData.couponId,
                                        couponValue: req.body.newFormData.couponValue,
                                        balanceToSettle: {
                                            balance: parseFloat(req.body.newFormData.balaceToPay) - parseFloat(req.body.newFormData.couponValue)

                                        }
                                    }], $position: 0
                                }
                            }
                        })
                    }
                } else {
                    if (req.body.newFormData.walletDebit) {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment + "AlongWithWallet",
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: parseInt(req.body.newFormData.total),
                                        walletDebit: req.body.newFormData.walletDebit,
                                        balanceToSettle: {
                                            balance: req.body.newFormData.balaceToPay

                                        }
                                    }], $position: 0
                                }
                            }
                        })

                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $inc: {
                                "wallet.balance": -(parseFloat(req.body.newFormData.walletDebit))
                            },
                            $push: {
                                "wallet.transaction": {
                                    $each: [
                                        {
                                            typeOfTransaction: 'debit',
                                            amount: parseFloat(req.body.newFormData.walletDebit)
                                        }
                                    ], $position: 0

                                }
                            }
                        })
                    } else {
                        await UserModal.updateOne({ _id: req.session.userId }, {
                            $push: {
                                orders: {
                                    $each: [{
                                        product: req.body.newFormData.productData,
                                        modeOfPayment: req.body.newFormData.modeOfPayment,
                                        addressToShip: req.body.newFormData.addressId,
                                        netTotal: req.body.newFormData.total,
                                        grossTotal: req.body.newFormData.total,
                                        balanceToSettle: {
                                            balance: req.body.newFormData.balaceToPay

                                        }

                                    }], $position: 0
                                }
                            }
                        })
                    }
                }
            }
            await Promise.all(req.body.newFormData.productData.map(async (product) => {
                let count = product.orderQuantity;
                try {
                    await ProductModal.updateOne(
                        { _id: product.productId },
                        { $inc: { quantity: -count } }
                    );
                } catch (error) {
                    console.error('Error updating product quantity:', error);
                    // Handle the error, such as logging it or sending an error response.
                }
            }));
            res.json({ success: true })
            req.body.newFormData = false
        }
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}
const getOrders = async (req, res, next) => {
    try {
        let brands = await BrandModal.distinct('brandName')
        const user = await UserModal.findOne({ _id: req.session.userId })
        const orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: true })
        res.render('users/order', { orders, brands, user });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
};
const getOrderSinglePage = async (req, res, next) => {
    try {
        let brands = await BrandModal.distinct('brandName');
        const user = await UserModal.findOne({ _id: req.session.userId });
        let orderId = req.query.Id;
        let orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: 1 }).lean();
        let order = orders.orders.find((order) => order._id.toString() === orderId.toString());
        let completeData = await Promise.all(order.product.map(async (products) => {
            try {
                const product = await ProductModal.findOne({ _id: products.productId }).lean();
                if (product) {
                    // Populate the 'gallery' and 'specification' fields
                    const populatedProduct = await ProductModal.populate(product, {
                        path: 'gallery', // Assuming 'gallery' is an array of strings
                        select: 'specification' // Specify the fields to populate
                    });
                    // Merge the populated fields into the original product
                    const mergedProduct = { ...product, ...populatedProduct };
                    // Merge with the product-specific order data
                    return { ...mergedProduct, ...products };
                }
            } catch (error) {
                console.log(error.message);
            }
        }));
        completeData.forEach((item, index) => {
            item.status = order.status; // Assuming 'status' is the correct field name
        });
        const addressToShip = user.shippingAddress.find((shippingAddress) => shippingAddress._id.toString() === order.addressToShip.toString())
        res.render('users/orderSinglePage', { order: completeData, addressToShip, brands, user, orderId });
        console.log("completeData",completeData)
    } catch (error) {
        errorHandler(error, req, res, next);
    }
}
const postCancellOrder = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const { orderId, cancelMessage, modeOfRefund } = req.body.newFormData;
        const updatedUser = await UserModal.updateOne(
            {
                _id: userId,
                'orders._id': orderId // Find the user by ID and match the order with the specified orderId
            },
            {
                $set: {
                    'orders.$.status': 'cancelledByClient', // Update the status of the matched order
                    'orders.$.cancelMessage': cancelMessage,
                    'orders.$.modeOfRefund': modeOfRefund
                }
            }
        );
        if (updatedUser.nModified === 1) {
            // Check if an order was actually updated
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Order not found or could not be cancelled' });
        }
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};
const postOrderReturnRequest = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const { orderId, returnMessage, modeOfRefund } = req.body.newFormData
        await UserModal.updateOne(
            {
                _id: userId,
                'orders._id': orderId // Find the user by ID and match the order with the specified orderId
            },
            {
                $set: {
                    'orders.$.status': 'returnInProgress', // Update the status of the matched order
                    'orders.$.returnMessage': returnMessage,
                    'orders.$.modeOfRefund': modeOfRefund
                }
            }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postWallet = async (req, res, next) => {
    try {
        let wallet = await UserModal.find({ _id: req.session.userId }, { _id: 0, "wallet.balance": 1 })
        res.json({ wallet })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postRazorPayCreateOrder = async (req, res, next) => {
    try {
        const amount = req.body.balaceToPay * 100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }
        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY,
                        // product_name: req.body.name,
                        // description: req.body.description,
                        contact: "8567345632",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com"
                    });
                }
                else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' });
                }
            }
        );
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postAddWalletMoney = async (req, res, next) => {
    try {
        let result = await UserModal.updateOne({ _id: req.session.userId }, {
            $inc: {
                "wallet.balance": (parseFloat(req.body.newFormData.amount))
            },
            $push: {
                "wallet.transaction": {
                    $each: [
                        {
                            typeOfTransaction: 'credit',
                            amount: parseFloat(req.body.newFormData.amount)
                        }
                    ], $position: 0

                }
            }
        })
        let wallet = await UserModal.find({ _id: req.session.userId }, { _id: 0, "wallet.balance": 1 })
        res.json({ success: true, wallet })
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postMailCheck = async (req, res, next) => {
    try {
        let validation = await UserModal.find({ email: req.body.email })
        if (validation.length) {
            res.json({ mailExist: true })
        } else {
            res.json({ mailExist: false })
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
const postRateProduct = async (req, res, next) => {
    try {
        let { userId, rating, orderId, productId, userName } = req.body.rating;
        // Validate 'rating' to ensure it's a valid integer
        rating = parseInt(rating);
        if (isNaN(rating)) {
            return res.status(400).json({ error: 'Invalid rating value' });
        }
        // Update the rating in the user's order
        const result = await UserModal.findOneAndUpdate(
            {
                _id: userId,
                "orders._id": orderId,
                "orders.product.productId": productId
            },
            {
                $set: { "orders.$[orderElem].product.$[productElem].rating": rating }
            },
            {
                arrayFilters: [
                    { "orderElem._id": orderId },
                    { "productElem.productId": productId }
                ]
            }
        );
        if (!result) {
            return res.status(404).json({ error: 'Record not found' });
        }
        const product = await ProductModal.findOne({ _id: productId, "rating.userId": userId });
        if (product) {
            // User has already rated the product, update the existing rating
            await ProductModal.updateOne(
                { _id: productId, "rating.userId": userId },
                { $set: { "rating.$.rate": rating } }
            );
        } else {
            // User hasn't rated the product, unshift a new rating entry
            await ProductModal.updateOne(
                { _id: productId },
                { $push: { rating: { rate: rating, userName: userName, userId } } }
            );
        }
        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
}
const postReviewProduct = async (req, res, next) => {
    try {
        let { userId, review, orderId, productId, userName } = req.body.review;
        const result = await UserModal.findOneAndUpdate(
            {
                _id: userId,
                "orders._id": orderId,
                "orders.product.productId": productId
            },
            {
                $set: { "orders.$[orderElem].product.$[productElem].review": review }
            },
            {
                arrayFilters: [
                    { "orderElem._id": orderId },
                    { "productElem.productId": productId }
                ]
            }
        );
        if (!result) {
            return res.status(404).json({ error: 'Record not found' });
        }
        const product = await ProductModal.findOne({ _id: productId, "review.userId": userId });
        if (product) {
            // User has already rated the product, update the existing rating
            await ProductModal.updateOne(
                { _id: productId, "review.userId": userId },
                { $set: { "review.$.review": review } }
            );
        } else {
            // User hasn't rated the product, unshift a new rating entry
            await ProductModal.updateOne(
                { _id: productId },
                { $push: { review: { review: review, userName: userName, userId } } }
            );
        }
        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
}
module.exports = {
    userHome,
    getUserHomeSort,
    getSearch,
    getBrandSort,
    getFilterBrandSort,
    getUserSignUp,
    postUserSignUp,
    getUserOtpVerificationCode,
    getResendOtp,
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
    postRemoveFromCart,
    getCheckOutPage,
    postBuySelectedProducts,
    postOrderPlacement,
    getOrders,
    getOrderSinglePage,
    postCancellOrder,
    postOrderReturnRequest,
    postWallet,
    postRazorPayCreateOrder,
    postAddWalletMoney,
    postMailCheck,
    postRateProduct,
    postReviewProduct
}