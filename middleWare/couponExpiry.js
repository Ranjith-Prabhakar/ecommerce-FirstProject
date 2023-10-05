const CouponModel = require('../model/couponModal'); // Import your Coupon model
async function updateExpiredCoupons(req,res,next) {
  const currentDate = new Date();
  try {
    await CouponModel.updateMany(
      { expiryDate: { $lte: currentDate }, active: true },
      { $set: { active: false } }
    );
    next()
  } catch (error) {
    console.error('Error updating expired coupons:', error);
  }
}

module.exports = updateExpiredCoupons
