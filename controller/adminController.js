const AdminModal = require('../model/adminModal')
const UserModal = require('../model/userModal')
const BrandModal = require('../model/brandModal')
require('dotenv').config()
const randomString = require('randomstring')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const { errorHandler } = require('../middleWare/errorMiddleWare')
const moment = require('moment');

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
            bcrypt.compare(req.body.password, adminData.password, async (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                } else {
                    if (result) {
                        req.session.isAdmin = true

                        let hash = await bcrypt.hash('helloworld', 2)
                        req.session.adminHash = hash

                        res.cookie('password', hash)
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

// const getAdminPanel = async (req, res, next) => {

//     try {

//         if (req.session.isAdmin) {
//             // Calculate the date six months ago from the current date
//             const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();


//             // Aggregate to calculate sales for each brand and month
//             await UserModal.aggregate([
//                 {
//                     $match: {
//                         'orders.orderDate': {
//                             $gte: sixMonthsAgo, // Filter orders within the last six months
//                         },
//                     },
//                 },
//                 {
//                     $unwind: '$orders',
//                 },
//                 {
//                     $unwind: '$orders.product',
//                 },
//                 {
//                     $lookup: {
//                         from: 'products', // Replace with the actual name of your products collection
//                         localField: 'orders.product.productId',
//                         foreignField: '_id',
//                         as: 'productInfo',
//                     },
//                 },
//                 {
//                     $unwind: '$productInfo',
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             brandName: '$productInfo.brandName',
//                             month: { $month: '$orders.orderDate' },
//                             year: { $year: '$orders.orderDate' },
//                         },
//                         totalSales: { $sum: 1 },
//                     },
//                 },
//                 {
//                     $sort: {
//                         '_id.year': 1,
//                         '_id.month': 1,
//                     },
//                 },
//                 {
//                     $group: {
//                         _id: '$_id.brandName',
//                         salesData: {
//                             $push: {
//                                 month: '$_id.month',
//                                 year: '$_id.year',
//                                 totalSales: '$totalSales',
//                             },
//                         },
//                     },
//                 },
//                 {
//                     $project: {
//                         _id: 1,
//                         salesData: 1,
//                         'orders.orderDate': 1, // Include orderDate for debugging
//                     },
//                 },
//             ])
//             .exec()
//             .then((result) => {
//                 console.log("result", result);
//                 res.render('./admin/adminPanel', { adminPanel: true,result})
//                 // Iterate through the result array
//                 result.forEach((brandData) => {
//                     console.log(`Brand: ${brandData._id}`);
//                     console.log("Sales Data:");

//                     // Iterate through the salesData array for this brand
//                     brandData.salesData.forEach((sales) => {
//                         console.log(`Month: ${sales.month}, Year: ${sales.year}, Total Sales: ${sales.totalSales}`);
//                     });

//                     console.log(); // Add an empty line for better readability
//                 });
//             })
//             .catch((err) => {
//                 console.error(err);
//             });



//         } else {
//             req.body.unAutherisedAdmin = 'login first'
//             res.redirect('/adminLogin')
//         }
//     } catch (err) {
//         errorHandler(err, req, res, next);
//     }
// }
const getAdminPanel = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            let filterData = {}
            //ordered products
            await UserModal.aggregate([
                {
                    $unwind: '$orders',
                },
                {
                    $unwind: '$orders.product',
                },
                {
                    $lookup: {
                        from: 'products', // Replace with the actual name of your products collection
                        localField: 'orders.product.productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    },
                },
                {
                    $unwind: '$productInfo',
                },
                {
                    $group: {
                        _id: '$productInfo.brandName', // Use brandName as the _id
                        totalSales: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        totalSales: 1,
                    },
                },
            ])
                .exec()
                .then((result) => {
                    console.log("result", result);
                    filterData.order = result
                })
                .catch((err) => {
                    console.error(err);
                });
            /////////////////////// sold product
            await UserModal.aggregate([
                {
                    $unwind: '$orders',
                },
                {
                    $match: {
                        'orders.status': 'delivered', // Filter orders with status "delivered"
                    },
                },
                {
                    $unwind: '$orders.product',
                },
                {
                    $lookup: {
                        from: 'products', // Replace with the actual name of your products collection
                        localField: 'orders.product.productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    },
                },
                {
                    $unwind: '$productInfo',
                },
                {
                    $group: {
                        _id: '$productInfo.brandName', // Use brandName as the _id
                        totalSales: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        totalSales: 1,
                    },
                },
            ])

                .exec()
                .then((result) => {
                    console.log("result", result);
                    filterData.sold = result

                })
                .catch((err) => {
                    console.error(err);
                });
            //brands and product counts
                let brandsAndProduct = await BrandModal.find({})
                filterData.brandsAndProduct = brandsAndProduct

                //brands and revenue
                await UserModal.aggregate([
                    {
                        $unwind: '$orders',
                    },
                    {
                        $match: {
                            'orders.status': 'delivered', // Filter orders with status "delivered"
                        },
                    },
                    {
                        $unwind: '$orders.product',
                    },
                    {
                        $lookup: {
                            from: 'products', // Replace with the actual name of your products collection
                            localField: 'orders.product.productId',
                            foreignField: '_id',
                            as: 'productInfo',
                        },
                    },
                    {
                        $unwind: '$productInfo',
                    },
                    {
                        $group: {
                            _id: '$productInfo.brandName', // Use brandName as the _id
                            totalSales: { $sum: 1 },
                            totalAmountReceived: { $sum: { $toDouble: '$orders.grossTotal' } }, // Assuming grossTotal is a string, convert it to a number
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            totalSales: 1,
                            totalAmountReceived: 1,
                        },
                    },
                ]) .exec()
                .then((result) => {
                    console.log("result", result);
                    filterData.brandRevenue = result

                })
                .catch((err) => {
                    console.error(err);
                });
                

            res.render('./admin/adminPanel', { adminPanel: true, filterData })

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