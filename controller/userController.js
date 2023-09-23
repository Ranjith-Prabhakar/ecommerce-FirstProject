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
const Razorpay = require('razorpay');
const userModal = require('../model/userModal')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});




const userHome = async (req, res, next) => {
    try {
        const page = req.params.paramName ? parseInt(req.params.paramName) : 1; // Parse the page number

        const itemsPerPage = 5; // Number of products per page
        const start = (page - 1) * itemsPerPage;
        let user, brands, products, productsCount, banner;
        console.log("req.params.i", req.params);
        console.log("start,itemsPerPage", start, itemsPerPage);
        if (req.session.userId) {
            user = await UserModal.findOne({ _id: req.session.userId });
            brands = await BrandModal.distinct('brandName')
            products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage);
            productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
            banner = await BannerModal.find()
            res.render('./users/userHome', { user, brands, products, banner, productsCount })
        } else {

            brands = await BrandModal.distinct('brandName')
            products = await ProductModal.find({ freez: 'active' }).skip(start).limit(itemsPerPage);
            productsCount = await ProductModal.find({ freez: { $eq: 'active' } }).count() / 5
            banner = await BannerModal.find()

            res.render('./users/userHome', { brands: brands, products, banner, productsCount })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
///have to check it
const getSearch = async (req, res, next) => {
    try {
        // if (req.session.isAdmin) {
        //     res.redirect('/digiWorld/admin/adminPanel')
        // }else
        if (req.session.userId) {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });

            // let banner = await BannerModal.find()
            res.render('./users/productSearch', { user, brands: brands, products })/// 
        } else {
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({
                $or: [
                    { productName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' },
                    { brandName: { $regex: new RegExp(`^${req.query.search}`, 'i') }, freez: 'active' }
                ]
            });

            // let banner = await BannerModal.find()
            console.log(req.body.search);
            res.render('./users/productSearch', { brands: brands, products })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getUserLogin = async (req, res, next) => {
    try {
        if (errorMessages) {
            res.render('./users/userLogin', { errorMessages})
            errorMessages = ""
        }
        else {
            res.render('./users/userLogin')
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
            res.render('./users/userSignUp', { errorMessage: req.session.errorMessage, signUp: true })
            req.session.errorMessage = ''
        } else {
            res.render('./users/userSignUp', { signUp: true })
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
            //  else {
            //     req.session.errorMessage = 'invalid userName or password'
            //     res.redirect('/userSignUp')
            // }

        } else {
            let hash = await bcrypt.hash(req.body.password, 4)
            req.session.userEmail = req.body.email
            const newUser = await UserModal({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                // userName: req.body.userName,
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
        console.log('inside postUserSignUp');
        console.log('inside postUserSignUp');
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

const getResendOtp = async (req, res, next) => {
    try {
        console.log('inside postResendOtp');
        console.log("req.session.email", req.session.userEmail);

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
        console.log("This is the reotp: ", reotp)
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
    setTimeout(() => { console.log("set req.session.otp", req.session.otp) }, 10000)

    try {

        console.log("req.body.otp", req.body.otp);
        console.log("req.session.otp , RE", req.session.otp);
        console.log("req.session ---->", req.session);
        if (req.body.otp === req.session.otp) {
            await UserModal.updateOne({ email: req.session.userEmail }, { $set: { isVerified: true } })
            errorMessages = 'signedUp successfully, Login Now'
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
            res.render('./users/brandPage', { brands, products })
        } else {
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let products = await ProductModal.find({ brandName: req.query.brandName, freez: { $eq: 'active' } })
            res.render('./users/brandPage', { brands, products, user })
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
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            const filterProducts = await ProductModal.find({ brandName: { $in: [...brand] } }).sort({ brandName: 1 })
            res.render('./users/productFilter', { brands, filterProducts, user })
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
            let user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            let product = await ProductModal.findOne({ _id: req.query.id })
            res.render('./users/singleProduct', { brands, product, user })
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const user = await UserModal.findOne({ _id: req.session.userId })
        let brands = await BrandModal.distinct('brandName')
        res.render('./users/userProfile', { user, brands })
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

        // await UserModal.updateOne(
        //     { _id: formDataObject.userId },
        //     { $push: { shippingAddress: formDataObject } }
        // );

        await UserModal.updateOne(
            // { _id: formDataObject.userId },
            { _id: req.session.userId },
            { $push: { shippingAddress: { $each: [formDataObject], $position: 0 } } }
        );

        res.json({ success: true })
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};
const postEditAddress = async (req, res, next) => {
    console.log('inside postEditAddress ');
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
            console.log("userId", userId);
            let index = req.body.index
            console.log("index", index);
            let newObject = req.body.newAddressFormData
            console.log("newObject", newObject);
            delete newObject.userId
            console.log("after delete ", newObject);
            await UserModal.updateOne({ _id: userId }, { $set: { [`shippingAddress.${index}`]: newObject } })
            res.json({ success: true })
        }
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
// const postEditAddress = async (req, res, next) => {
//     console.log('inside postEditAddress ');
//     try {
//         let userId = req.body.newAddressFormData.userId
//         console.log("userId",userId);
//         let index = req.body.index
//         console.log("index",index);
//         let newObject = req.body.newAddressFormData
//         console.log("newObject",newObject);
//         delete newObject.userId
//         console.log("after delete ",newObject);
//         await UserModal.updateOne({ _id: userId }, { $set: { [`shippingAddress.${index}`]: newObject } })
//         res.json({ success: true })
//     } catch (error) {
//         errorHandler(error, req, res, next)
//     }
// }



const postDeleteAddress = async (req, res, next) => {
    try {
        const { userId, index, objectId } = req.body
        console.log(objectId);
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



        res.render('./users/cart', { cartProducts, cartValue, user, brands }); // Pass cartProducts to the EJS template
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};




const postAddToCart = async (req, res, next) => {
    try {
        let count = req.body.count ? req.body.count : 1
        let result = await UserModal.updateOne({ _id: req.body.userId, "cart": { $not: { $elemMatch: { productId: req.body.productId } } } },
            { $addToSet: { cart: { productId: req.body.productId, quantity: count } } })
        console.log(result);
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

// const getCheckOutPage = async (req, res, next) => {
//     try {
//         if (req.query.productId) {//singleProduct
//             let singleProduct = await ProductModal.findOne({ _id: req.query.productId });
//             let user = await UserModal.findOne({ _id: req.session.userId })
//             let brands = await BrandModal.distinct('brandName')
//             res.render('./users/checkOutPage', { singleProduct, user, brands });
//             req.query.productId = '';
//         } else if (req.session.selectedProducts && req.session.selectedProducts.length) {//selected cart
//             let user = await UserModal.findOne({ _id: req.session.userId })
//             let brands = await BrandModal.distinct('brandName')
//             let productIds = req.session.selectedProducts.map((product) => product.productId);
//             let matchingProducts = await ProductModal.find({ _id: { $in: productIds } });

//             let productList = matchingProducts.map((product) => {
//                 let selectedProduct = req.session.selectedProducts.find((selected) => selected.productId === product._id.toString());
//                 if (selectedProduct) {
//                     return {
//                         ...product.toObject(),
//                         orderQuantity: selectedProduct.productQuantity,
//                     };
//                 } else {
//                     return product.toObject();
//                 }
//             });
//             req.session.selectedProducts.length = 0;
//             req.session.productList = productList
//             res.render('./users/checkOutPage', { productList, user, brands });
//         } else if (req.query.cart) {
//             const user = await UserModal.findOne({ _id: req.session.userId });
//             let brands = await BrandModal.distinct('brandName')
//             const cart = user.cart;
//             const productIds = cart.map((item) => item.productId);

//             const matchingProducts = await ProductModal.find({ _id: { $in: productIds } });


//             let productList = matchingProducts.map((product) => {
//                 cart.forEach((cart) => {

//                     if (cart.productId.equals(product._id)) {
//                         let orderQuantity = cart.quantity
//                         product.orderQuantity = orderQuantity
//                     }
//                 })
//                 return product
//             })

//             req.query.cart = false;
//             req.session.productList = productList
//             console.log("req.session.productList[0].orderQuantity", req.session.productList[0].orderQuantity);
//             res.render('./users/checkOutPage', { productList, user, brands });
//         }
//     } catch (error) {
//         errorHandler(error, req, res, next);
//     }
// };

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
            console.log("user", user);
            console.log("user wallet", user.wallet.balance);
            let brands = await BrandModal.distinct('brandName')
            res.render('./users/checkOutPage', { singleProduct, user, brands, coupons });
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
            res.render('./users/checkOutPage', { productList, user, brands, coupons });
        } else if (req.query.cart) {//cart
            let coupons = {}
            const user = await UserModal.findOne({ _id: req.session.userId });
            let brands = await BrandModal.distinct('brandName')
            const cart = user.cart;
            const productIds = cart.map((item) => item.productId);
            const matchingProducts = await ProductModal.find({ _id: { $in: productIds } });
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
            console.log('matchingPriceCouponsFiltered', matchingPriceCouponsFiltered);
            coupons.priceCoupons = matchingPriceCoupons
            res.render('./users/checkOutPage', { productList, user, brands, coupons });
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

        if (req.body.newFormData.walletDebit) {
            console.log("req.body.newFormData.walletDebit", req.body.newFormData.walletDebit);
            console.log("req.body.newFormData.walletDebit typeof", typeof req.body.newFormData.walletDebit);
            console.log("req.body.newFormData.walletDebit typeof", typeof -(parseFloat(req.body.newFormData.walletDebit)));
            console.log("req.body.newFormData.walletDebit ", -(parseFloat(req.body.newFormData.walletDebit)));
        }


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

                        console.log('with coupon and wallet');
                        console.log("req.body.newFormData", req.body.newFormData);
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



            // await UserModal.updateOne({ _id: req.session.userId }, {
            //     $push: {
            //         orders: {
            //             product: req.body.newFormData.productData,
            //             modeOfPayment: req.body.newFormData.modeOfPayment,
            //             addressToShip: req.body.newFormData.addressId,
            //             total: req.body.newFormData.total
            //         }
            //     }
            // })
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

        res.render('./users/order', { orders, brands, user });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
};

// const getOrderSinglePage = async (req, res, next) => {
//     try {
//         let brands = await BrandModal.distinct('brandName')
//         const user = await UserModal.findOne({ _id: req.session.userId })
//         let orderId = req.query.Id
//         let orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: 1 })
//         let order = orders.orders.find((order) => order._id.toString() === orderId.toString())
//         console.log("order", order);
//         console.log("order.product", order.product);

//         let completeData = await Promise.all(order.product.map(async (products) => {
//             try {
//                 let product = await ProductModal.findOne({ _id: products.productId }).lean();
//                 console.log("inside map", product);
//                 return { ...product, ...products };
//             } catch (error) {
//                 console.log(error.message);
//             }
//         }));
//         console.log("completeData", completeData[0].product);

//         res.render('./users/orderSinglePage', { order, brands, user })

//     } catch (error) {
//         errorHandler(error, req, res, next)

//     }
// }

// const getOrderSinglePage = async (req, res, next) => {
//     try {
//         let brands = await BrandModal.distinct('brandName');
//         const user = await UserModal.findOne({ _id: req.session.userId });
//         let orderId = req.query.Id;
//         let orders = await UserModal.findOne({ _id: req.session.userId }, { _id: 0, orders: 1 }).lean();
//         let order = orders.orders.find((order) => order._id.toString() === orderId.toString());
//         console.log("order", order);
//         console.log("order.product", order.product);

//         // Populate the 'product' field within each 'order'
//         await Promise.all(order.product.map(async (products) => {
//             try {
//                 await ProductModal.populate(products, { path: 'productId' });
//             } catch (error) {
//                 console.log(error.message);
//             }
//         }));

//         console.log("order.product (after populating)", order.product);

//         res.render('./users/orderSinglePage', { order, brands, user });
//     } catch (error) {
//         errorHandler(error, req, res, next);
//     }
// }


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

        const addressToShip = user.shippingAddress.find((shippingAddress) => shippingAddress._id.toString() === order.addressToShip.toString())




        res.render('./users/orderSinglePage', { order: completeData, addressToShip, brands, user });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
}

const postCancellOrder = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const orderId = req.body.orderId;

        const updatedUser = await UserModal.updateOne(
            {
                _id: userId,
                'orders._id': orderId // Find the user by ID and match the order with the specified orderId
            },
            {
                $set: {
                    'orders.$.status': 'cancelledByClient' // Update the status of the matched order
                }
            }
        );

        if (updatedUser.nModified === 1) {
            // Check if an order was actually updated
            console.log('Order cancelled successfully');
        } else {
            console.log('Order not found or could not be cancelled');
        }

        res.status(200).json({ success: true });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

const postOrderReturnRequest = async (req, res, next) => {
    try {

        const userId = req.session.userId;
        const { orderId, returnMessage, modeOfRefund } = req.body.newFormData
        console.log("returnMessage", returnMessage);

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
        console.log("wallet", wallet);
        res.json({ wallet })
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}


const postRazorPayCreateOrder = async (req, res, next) => {
    try {
        console.log('inside postRazorPayCreateOrder');
        console.log('req.body.newFormData.total', req.body.total);

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
        console.log("req.body.newFormData", req.body.newFormData);
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
        console.log(result);
        res.json({ success: true, wallet })
    } catch (error) {
        errorHandler(error, req, res, next)

    }
}

module.exports = {
    userHome,
    getSearch,
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
    postAddWalletMoney
}