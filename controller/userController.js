const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
const ProductModal = require('../model/productModal')
const BannerModal = require('../model/bannarModal')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')
const { errorHandler } = require('../middleWare/errorMiddleWare')
require('dotenv').config()
// global variables
let errorMessages
//razorpay
const Razorpay = require('razorpay');
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
    postWallet,
    postRazorPayCreateOrder,
    postAddWalletMoney,
    postMailCheck,
    postRateProduct,
    postReviewProduct
}