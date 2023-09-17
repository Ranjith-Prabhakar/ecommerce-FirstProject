const CouponModel = require('../model/couponModal'); // Import your Coupon model


async function updateExpiredCoupons() {
  const currentDate = new Date();
  
  try {
    await CouponModel.updateMany(
      { expiryDate: { $lte: currentDate }, active: true },
      { $set: { active: false } }
    );
    console.log('Expired coupons updated.');
  } catch (error) {
    console.error('Error updating expired coupons:', error);
  }
}

module.exports = updateExpiredCoupons
