const { errorHandler } = require("../middleWare/errorMiddleWare")
const CouponModal = require('../model/couponModal')
const ProductModal = require('../model/productModal')
const BrandModal = require('../model/brandModal')
const getCouponManagement = async (req, res, next) => {
  try {
    const brands = await BrandModal.distinct('brandName')
    const products = await ProductModal.find({})
    const coupons = await CouponModal.find({}).sort({ createdAt: -1 })
    res.render('admin/couponManagement/couponManagement', { brands, products, coupons })
  } catch (error) {
    errorHandler(error, req, res, next)
  }
}
const postCreateCoupon = async (req, res, next) => {
  try {
    let { noOfSuccessTransaction, product, dateBelow, expiryDays, amountRange, couponCode, couponValue, criteria, brand } = req.body.newFormData
    let coupon = {
      expiryDays: expiryDays,
      couponCode: couponCode,
      couponValue: couponValue,
      criteria: criteria,
    }
    if (criteria === 'brand') {
      coupon.brand = brand
    } else if (criteria === "product") {
      coupon.product = product
    } else if (criteria === "price") {
      coupon.amountRange = amountRange
    } else if (criteria === 'date') {
      coupon.dateBelow = dateBelow
    } else if (criteria === 'customer') {
      coupon.noOfSuccessTransaction = noOfSuccessTransaction
    }
    const Coupon = await CouponModal(coupon)
    await Coupon.save()
    res.json({ success: true })
  } catch (error) {
    errorHandler(error, req, res, next)
  }
}
const postCouponCancell = async (req, res, next) => {
  try {
    let result = await CouponModal.updateOne({ _id: req.body.couponData.couponId }, { $set: { active: false } })
    res.json({ success: true })
  } catch (error) {
    errorHandler(req, res, next)
  }
}
module.exports = {
  getCouponManagement,
  postCreateCoupon,
  postCouponCancell
}