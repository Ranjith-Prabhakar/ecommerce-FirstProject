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
//     res.end()
// }


////////////////==============================================================================================
const getAdminLogin = (req, res, next) => {
    try {
        if (req.session.unAutherisedAdmin) {
            res.render('admin/adminLogIn', { unAutherisedAdmin: req.session.unAutherisedAdmin, login: true })////
            req.session.unAutherisedAdmin = ""
        } else if (req.session.loginErrorMessage) {
            res.render('admin/adminLogIn', { loginErrorMessage: req.session.loginErrorMessage, login: true })////
            req.session.loginErrorMessage = ""
        }
        else {
            res.render('admin/adminLogIn', { login: true })////
        }
    } catch (err) {
        errorHandler(err, req, res, next);
    }
}
const postAdminLogin = async (req, res,next) => {
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
        errorHandler(error, req, res, next);
    }
}
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
            ]).exec()
                .then((result) => {
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
const getSalesReport = async (req, res, next) => {
    try {
            let orders = await UserModal.find({}, { firstName: 1, lastName: 1, orders: 1 });
            let salesReport = []
            for (let i = 0; i < orders.length; i++) {
              for (let j = 0; j < orders[i].orders.length; j++) {
                salesReport.push({
                  userId: orders[i]._id,
                  firstName: orders[i].firstName,
                  lastName: orders[i].lastName,
                  total: orders[i].orders[j].grossTotal,
                  orderId: orders[i].orders[j]._id,
                  orderDate: orders[i].orders[j].orderDate,
                  status: orders[i].orders[j].status
                })
              }
            }
            let delivered = salesReport.filter(salesReport=>salesReport.status === "delivered")
        res.render('./admin/salesReport/salesReport', { delivered})
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}
module.exports = {
    // getAdminSignUp,
    // postAdminSignUp,
    getAdminLogin,
    postAdminLogin,
    getAdminPanel,
    postAdminLogout,
    getSalesReport
}